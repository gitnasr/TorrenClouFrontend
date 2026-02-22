import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    backendToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      // image is never populated by the auth flow; omitting it here removes the
      // false impression that it is always available.
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string
    user?: {
      id?: string
      name?: string | null
      email?: string | null
    }
  }
}
