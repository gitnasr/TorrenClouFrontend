import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import axios from 'axios'
import https from 'https'
import type { BackendAuthResponse } from '@/types/api'
import type { ExtendedAccount } from '@/types/auth'

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      console.log('signIn', account)
      if (account?.provider === 'google' && account.id_token) {
        try {
          // Send id_token to backend
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false, // Allow self-signed certificates for localhost
          })
          
          const response = await axios.post<BackendAuthResponse>(
            `https://localhost:7185/api/auth/google-login`,
            {
              idToken: account.id_token,
              provider: account.provider,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              httpsAgent,
            }
          )

          const data = response.data
          // Store backend response in account for later use in JWT callback
          // Note: In NextAuth v5, we need to pass this through the JWT callback
          const extendedAccount = account as ExtendedAccount
          extendedAccount.backendToken = data.accessToken
          extendedAccount.userData = data.user
          return true
        } catch (error) {
          console.error('Backend auth error:', (error as any).response)
          return false
        }
      }
      return true
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        const extendedAccount = account as ExtendedAccount
        token.backendToken = extendedAccount.backendToken
        if (extendedAccount.userData) {
          token.user = extendedAccount.userData
        } else {
          token.user = {
            id: user.id || '',
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.backendToken) {
        session.backendToken = token.backendToken
      }
      if (token.user) {
        if (session.user) {
          session.user.id = token.user.id || session.user.id
          session.user.name = token.user.name ?? session.user.name ?? null
          session.user.email = token.user.email ?? session.user.email ?? null
          session.user.image = token.user.image ?? session.user.image ?? null
          session.user.balance = token.user.balance
          session.user.region = token.user.region
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
} satisfies NextAuthConfig

