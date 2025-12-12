// API Response Types

export interface QuoteResponse {
  cost: number
  size: number
  health: number
  filename: string
}

export interface StartJobResponse {
  jobId: string
}

export interface TorrentJob {
  id: string
  filename: string
  size: number
  status: 'Downloading' | 'Uploading' | 'Completed' | 'Failed'
  progress: number
  createdAt: string
}

export interface Transaction {
  id: string
  type: 'Deposit' | 'Payment' | 'Refund'
  amount: number
  description: string
  createdAt: string
}

export interface WalletBalanceResponse {
  balance: number
}

export interface BackendAuthResponse {
  accessToken: string
  user: BackendUserData
}

export interface BackendUserData {
  id: string
  name: string | null
  email: string | null
  image?: string | null
  balance?: number
  region?: string
}

