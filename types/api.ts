// API Response Types - Complete DTOs matching backend
import {
  RegionCode,
  UserRole,
  StorageProviderType,
  TransactionType,
  DepositStatus,
  JobStatus,
  JobType,
  DiscountType,
} from './enums'

// ============================================
// User Models
// ============================================

export interface User {
  id: number
  email: string
  fullName: string
  oauthProvider: string
  phoneNumber: string
  isPhoneNumberVerified: boolean
  region: RegionCode
  role: UserRole
  currentBalance: number
}

export interface AuthResponse {
  accessToken: string
  email: string
  fullName: string
  currentBalance: number
  role: string
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
  role?: UserRole
}

// ============================================
// Wallet Models
// ============================================

export interface WalletBalance {
  balance: number
  currency: string
}

export interface WalletTransaction {
  id: number
  amount: number
  type: TransactionType
  referenceId?: string
  description: string
  createdAt: string
}

// ============================================
// Deposit Models
// ============================================

export interface Deposit {
  id: number
  amount: number
  currency: string
  paymentProvider: string
  paymentUrl?: string
  status: DepositStatus
  createdAt: string
  updatedAt?: string
}

export interface CryptoDepositRequest {
  amount: number
  currency: string
}

export interface StablecoinMinAmount {
  currency: string
  minAmount: number
  fiatEquivalent: string
}

// ============================================
// Torrent Models
// ============================================

export interface TorrentFile {
  index: number
  path: string
  size: number
}

export interface ScrapeAggregationResult {
  seeders: number
  leechers: number
  completed: number
  trackersSuccess: number
  trackersTotal: number
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

export interface TorrentInfo {
  infoHash: string
  name: string
  totalSize: number
  files: TorrentFile[]
  trackers: string[]
  scrapeResult: ScrapeAggregationResult
}

export interface TorrentAnalysis {
  infoHash: string
  name: string
  totalSize: number
  files: TorrentFile[]
  trackers: string[]
  scrapeResult: ScrapeAggregationResult
}

export interface PricingSnapshot {
  totalSizeInBytes: number
  calculatedSizeInGb: number
  selectedFiles: string[]
  baseRatePerGb: number
  userRegion: string
  regionMultiplier: number
  healthMultiplier: number
  isCacheHit: boolean
  cacheDiscountAmount: number
  finalPrice: number
  calculatedAt: string
}

export interface QuoteRequest {
  selectedFilePaths: string[]
  storageProfileId: number
  torrentFile: File
  voucherCode?: string
}

export interface QuoteResponse {
  isReadyToDownload: boolean
  originalAmountInUSD: number
  finalAmountInUSD: number
  finalAmountInNCurrency: number
  torrentHealth: TorrentHealthMeasurements
  fileName: string
  sizeInBytes: number
  isCached: boolean
  infoHash: string
  message?: string
  pricingDetails: PricingSnapshot
  invoiceId: number
}

// Legacy compatibility
export interface LegacyQuoteResponse {
  cost: number
  size: number
  health: number
  filename: string
}

// ============================================
// Invoice Models
// ============================================

export interface Invoice {
  id: number
  userId: number
  jobId?: number
  originalAmountInUSD: number
  finalAmountInUSD: number
  finalAmountInNCurrency: number
  exchangeRate: number
  createdAt: string
  cancelledAt?: string
  paidAt?: string
  refundedAt?: string
  walletTransactionId?: number
  voucherId?: number
  torrentFileId: number
  expiresAt: string
  isExpired: boolean
  // Convenience fields for UI
  amount: number
  sizeInBytes: number
  fileName?: string
  status?: 'pending' | 'paid' | 'expired' | 'cancelled'
}

export interface InvoicePaymentResult {
  walletTransaction: number
  invoiceId: number
  jobId: number
  totalAmountInNCurrency: number
  hasStorageProfileWarning: boolean
  storageProfileWarningMessage?: string
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

export interface UserJob {
  id: number
  userId: number
  storageProfileId: number
  status: JobStatus
  type: JobType
  requestFileId: number
  errorMessage?: string
  currentState?: string
  startedAt?: string
  completedAt?: string
  lastHeartbeat?: string
  bytesDownloaded: number
  totalBytes: number
  selectedFilePaths: string[]
  progress: number
  // Display fields
  fileName?: string
  storageProfileName?: string
  createdAt?: string
}

export interface JobCreationResult {
  jobId: number
  invoiceId: number
  storageProfileId?: number
  hasStorageProfileWarning: boolean
  storageProfileWarningMessage?: string
}

// Legacy compatibility
export interface TorrentJob {
  id: string
  filename: string
  size: number
  status: 'Downloading' | 'Uploading' | 'Completed' | 'Failed'
  progress: number
  createdAt: string
}

export interface StartJobResponse {
  jobId: string
}

// ============================================
// Voucher Models
// ============================================

export interface Voucher {
  id: number
  code: string
  type: DiscountType
  value: number
  maxUsesTotal?: number
  maxUsesPerUser: number
  expiresAt?: string
  isActive: boolean
}

export interface VoucherValidationResult {
  isValid: boolean
  voucher?: Voucher
  discountAmount?: number
  errorMessage?: string
}

// ============================================
// Admin Models
// ============================================

export interface AdminDeposit {
  id: number
  userId: number
  userEmail: string
  userFullName: string
  amount: number
  currency: string
  paymentProvider: string
  gatewayTransactionId: string
  status: DepositStatus
  createdAt: string
  updatedAt?: string
}

export interface AdminWallet {
  userId: number
  userEmail: string
  userFullName: string
  balance: number
  transactionCount: number
  lastTransactionDate?: string
}

export interface AdminAdjustBalanceRequest {
  amount: number
  description: string
}

export interface ChartDataPoint {
  label: string
  amount: number
  count: number
}

export interface AdminDashboard {
  totalDepositsAmount: number
  totalDepositsCount: number
  pendingDepositsCount: number
  completedDepositsCount: number
  failedDepositsCount: number
  totalWalletBalance: number
  totalUsersWithBalance: number
  dailyDeposits: ChartDataPoint[]
  weeklyDeposits: ChartDataPoint[]
  monthlyDeposits: ChartDataPoint[]
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

// Legacy compatibility
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
