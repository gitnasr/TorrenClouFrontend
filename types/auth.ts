// NextAuth Extended Types

import type { User } from 'next-auth'
import type { BackendUserData, BackendAuthResponse } from './api'

// Custom account data to be stored on the account object
export interface ExtendedAccount {
  backendToken?: string
  userData?: BackendUserData
  [key: string]: unknown
}

export interface ExtendedUser extends User {
  backendToken?: string
}

export interface BackendAuthData {
  accessToken: string
  user: BackendUserData
}

export type BackendAuthResponseData = BackendAuthResponse
