import 'next-auth'
import 'next-auth/jwt'
import type { BackendUserData } from './api'

import type { UserRole } from './enums'

declare module 'next-auth' {
  interface Session {
    backendToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      balance?: number
      region?: string
      role?: UserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string
    user?: BackendUserData
  }
}

