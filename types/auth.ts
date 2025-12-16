// NextAuth Extended Types

import type { User } from 'next-auth'
import type { BackendUserData, BackendAuthResponse } from './api'

// Custom account data to be stored on the account object 
// We use type assertion when setting these values since Account has a string index signature
export interface ExtendedAccount {
  backendToken?: string
  userData?: BackendUserData
  [key: string]: unknown
}

export interface ExtendedUser extends User {
  balance?: number
  region?: string
}

export interface BackendAuthData {
  accessToken: string
  user: BackendUserData
}

export type BackendAuthResponseData = BackendAuthResponse
