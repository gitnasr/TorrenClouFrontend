// NextAuth Extended Types

import type { Account, User } from 'next-auth'
import type { BackendUserData, BackendAuthResponse } from './api'

export interface ExtendedAccount extends Account {
  backendToken?: string
  userData?: BackendUserData
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

