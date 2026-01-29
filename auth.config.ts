import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import axios from 'axios'
import https from 'https'
import type { BackendAuthResponse } from '@/types/api'

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false, // Allow self-signed certificates for localhost
          })

          const baseUrl = process.env.BACKEND_URL || 'https://localhost:7185'
          const response = await axios.post<BackendAuthResponse>(
            `${baseUrl}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              httpsAgent,
            }
          )

          const data = response.data
          
          // Return user object with backend token
          return {
            id: data.user?.id || credentials.email as string,
            email: data.user?.email || credentials.email as string,
            name: data.user?.name || data.user?.email || null,
            backendToken: data.accessToken,
          }
        } catch (error) {
          console.error('Backend auth error:', (error as any).response?.data || error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.backendToken = (user as any).backendToken
        token.user = {
          id: user.id || '',
          name: user.name ?? null,
          email: user.email ?? null,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.backendToken) {
        session.backendToken = token.backendToken as string
      }
      if (token.user) {
        const tokenUser = token.user as { id?: string; name?: string | null; email?: string | null }
        if (session.user) {
          session.user.id = tokenUser.id || session.user.id
          session.user.name = tokenUser.name ?? session.user.name ?? null
          session.user.email = tokenUser.email ?? session.user.email ?? null
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig
