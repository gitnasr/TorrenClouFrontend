// API Response Types - Complete DTOs matching backend
import {
  JobStatus,
  JobType,
} from './enums'

// Re-export canonical Zod-inferred types so existing imports from '@/types/api'
// continue to resolve while the authoritative definition lives in the domain module.
export type { TorrentAnalysisResponse } from './torrents'
export type { StorageProfile, OAuthCredential, GoogleDriveAuthResponse } from './storage'

// ============================================
// User Models
// ============================================

export interface User {
  id: number
  email: string
  fullName: string
}

export interface AuthResponse {
  accessToken: string
  email: string
  fullName: string
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
}

// ============================================
// Torrent Models
// ============================================

export interface TorrentFile {
  index: number
  path: string
  size: number
}

export interface TorrentHealthMeasurements {
  seeders: number
  leechers: number
  completed: number
  seederRatio: number
  isComplete: boolean
  isDead: boolean
  isWeak: boolean
  isHealthy: boolean
  healthScore: number
}

// ============================================
// Job Models
// ============================================

// Legacy type for backward compatibility
export interface TorrentJob {
  id: string
  filename: string
  size: number
  status: 'Downloading' | 'Uploading' | 'Completed' | 'Failed'
  progress: number
  createdAt: string
}

export interface UserJob {
  id: number
  storageProfileId: number
  status: JobStatus
  type: JobType
  requestFileId: number
  errorMessage?: string
  currentState?: string
  startedAt?: string
  completedAt?: string
  bytesDownloaded: number
  totalBytes: number
  selectedFilePaths: string[] | null
  progress: number
  // Display fields
  fileName?: string
  storageProfileName?: string
  createdAt?: string
  // Action state properties
  canRetry?: boolean
  canCancel?: boolean
}

export interface JobCreationResult {
  jobId: number
  storageProfileId: number
}

// ============================================
// Create Job Request
// ============================================

export interface CreateJobRequest {
  torrentFileId: number
  selectedFilePaths?: string[] | null
  storageProfileId: number
}

// ============================================
// Pagination Models
// ============================================

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
