// API Response Types - Complete DTOs matching backend
import {
  StorageProviderType,
  JobStatus,
  JobType,
} from './enums'

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

export interface TorrentAnalysisResponse {
  torrentFileId: number
  fileName: string
  infoHash: string
  totalSizeInBytes: number
  files: TorrentFile[]
  torrentHealth: TorrentHealthMeasurements
}

// ============================================
// Storage Profile Models
// ============================================

export interface StorageProfile {
  id: number
  profileName: string
  providerType: StorageProviderType
  isDefault: boolean
  isActive: boolean
  createdAt: string
}

export interface GoogleDriveAuthResponse {
  authorizationUrl: string
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
