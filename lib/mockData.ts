// Mock data generators for UI-only implementation
import {
    RegionCode,
    UserRole,
    StorageProviderType,
    TransactionType,
    DepositStatus,
    JobStatus,
    JobType,
    DiscountType,
} from '@/types/enums'

import type {
    User,
    WalletBalance,
    WalletTransaction,
    Deposit,
    TorrentFile,
    TorrentAnalysis,
    TorrentHealthMeasurements,
    PricingSnapshot,
    QuoteResponse,
    Invoice,
    StorageProfile,
    UserJob,
    Voucher,
    AdminDeposit,
    AdminWallet,
    AdminDashboard,
    ChartDataPoint,
    PaginatedResult,
} from '@/types/api'

// ============================================
// Mock User Data
// ============================================

export const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    oauthProvider: 'google',
    phoneNumber: '+1234567890',
    isPhoneNumberVerified: true,
    region: RegionCode.US,
    role: UserRole.User,
    currentBalance: 156.78,
}

export const mockAdminUser: User = {
    ...mockUser,
    id: 2,
    email: 'admin@torreclou.com',
    fullName: 'Admin User',
    role: UserRole.Admin,
    currentBalance: 1250.00,
}

// ============================================
// Mock Wallet Data
// ============================================

export const mockWalletBalance: WalletBalance = {
    balance: 156.78,
    currency: 'USD',
}

export const mockTransactions: WalletTransaction[] = [
    {
        id: 1,
        amount: 50.00,
        type: TransactionType.DEPOSIT,
        referenceId: 'DEP-001',
        description: 'USDT Deposit',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        amount: -12.50,
        type: TransactionType.PAYMENT,
        referenceId: 'INV-001',
        description: 'Payment for Ubuntu ISO download',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        amount: 100.00,
        type: TransactionType.DEPOSIT,
        referenceId: 'DEP-002',
        description: 'USDC Deposit',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        amount: -25.00,
        type: TransactionType.PAYMENT,
        referenceId: 'INV-002',
        description: 'Payment for Movie Pack download',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        amount: 5.00,
        type: TransactionType.BONUS,
        description: 'Welcome bonus',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 6,
        amount: 12.50,
        type: TransactionType.REFUND,
        referenceId: 'REF-001',
        description: 'Refund for failed job',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

// ============================================
// Mock Deposits
// ============================================

export const mockDeposits: Deposit[] = [
    {
        id: 1,
        amount: 50.00,
        currency: 'USDT',
        paymentProvider: 'Crypto',
        paymentUrl: 'https://pay.example.com/deposit/1',
        status: DepositStatus.Completed,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    },
    {
        id: 2,
        amount: 100.00,
        currency: 'USDC',
        paymentProvider: 'Crypto',
        paymentUrl: 'https://pay.example.com/deposit/2',
        status: DepositStatus.Completed,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
    },
    {
        id: 3,
        amount: 25.00,
        currency: 'USDT',
        paymentProvider: 'Crypto',
        paymentUrl: 'https://pay.example.com/deposit/3',
        status: DepositStatus.Pending,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        amount: 75.00,
        currency: 'BUSD',
        paymentProvider: 'Crypto',
        status: DepositStatus.Failed,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 86400000).toISOString(),
    },
    {
        id: 5,
        amount: 200.00,
        currency: 'USDC',
        paymentProvider: 'Crypto',
        status: DepositStatus.Expired,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

// ============================================
// Mock Torrent Data
// ============================================

export const mockTorrentFiles: TorrentFile[] = [
    { index: 0, path: 'Ubuntu 22.04.3 LTS/ubuntu-22.04.3-desktop-amd64.iso', size: 4800000000 },
    { index: 1, path: 'Ubuntu 22.04.3 LTS/README.txt', size: 2048 },
    { index: 2, path: 'Ubuntu 22.04.3 LTS/SHA256SUMS', size: 512 },
]

export const mockTorrentAnalysis: TorrentAnalysis = {
    infoHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    name: 'Ubuntu 22.04.3 LTS Desktop',
    totalSize: 4800002560,
    files: mockTorrentFiles,
    trackers: [
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://open.stealth.si:80/announce',
        'udp://tracker.torrent.eu.org:451/announce',
    ],
    scrapeResult: {
        seeders: 1250,
        leechers: 85,
        completed: 45000,
        trackersSuccess: 3,
        trackersTotal: 3,
    },
}

export const mockTorrentHealth: TorrentHealthMeasurements = {
    seeders: 1250,
    leechers: 85,
    completed: 45000,
    seederRatio: 14.7,
    isComplete: true,
    isDead: false,
    isWeak: false,
    isHealthy: true,
    healthScore: 92,
}

export const mockPricingSnapshot: PricingSnapshot = {
    totalSizeInBytes: 4800000000,
    totalSizeInGb: 4.47,
    selectedFiles: [0],
    baseRatePerGb: 2.50,
    userRegion: 'US',
    regionMultiplier: 1.0,
    healthMultiplier: 0.9,
    isCacheHit: false,
    cacheDiscountAmount: 0,
    finalPrice: 10.07,
    calculatedAt: new Date().toISOString(),
}

export const mockQuoteResponse: QuoteResponse = {
    isReadyToDownload: true,
    originalAmountInUSD: 11.18,
    finalAmountInUSD: 10.07,
    finalAmountInNCurrency: 10.07,
    torrentHealth: mockTorrentHealth,
    fileName: 'Ubuntu 22.04.3 LTS Desktop',
    sizeInBytes: 4800000000,
    isCached: false,
    infoHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    pricingDetails: mockPricingSnapshot,
    invoiceId: 1,
}

// ============================================
// Mock Invoices
// ============================================

export const mockInvoices: Invoice[] = [
    {
        id: 1,
        userId: 1,
        jobId: 1,
        originalAmountInUSD: 11.18,
        finalAmountInUSD: 10.07,
        finalAmountInNCurrency: 10.07,
        exchangeRate: 1.0,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        walletTransactionId: 2,
        torrentFileId: 1,
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        amount: 10.07,
        sizeInBytes: 4800000000,
        fileName: 'Ubuntu 22.04.3 LTS Desktop',
        status: 'paid',
    },
    {
        id: 2,
        userId: 1,
        jobId: 2,
        originalAmountInUSD: 25.00,
        finalAmountInUSD: 25.00,
        finalAmountInNCurrency: 25.00,
        exchangeRate: 1.0,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        walletTransactionId: 4,
        torrentFileId: 2,
        expiresAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        amount: 25.00,
        sizeInBytes: 8500000000,
        fileName: 'Movie Collection Pack',
        status: 'paid',
    },
    {
        id: 3,
        userId: 1,
        originalAmountInUSD: 15.50,
        finalAmountInUSD: 15.50,
        finalAmountInNCurrency: 15.50,
        exchangeRate: 1.0,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        torrentFileId: 3,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        isExpired: false,
        amount: 15.50,
        sizeInBytes: 2100000000,
        fileName: 'Linux Mint 21.2',
        status: 'pending',
    },
    {
        id: 4,
        userId: 1,
        originalAmountInUSD: 8.75,
        finalAmountInUSD: 8.75,
        finalAmountInNCurrency: 8.75,
        exchangeRate: 1.0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        torrentFileId: 4,
        expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isExpired: true,
        amount: 8.75,
        sizeInBytes: 1800000000,
        fileName: 'Fedora Workstation 39',
        status: 'expired',
    },
]

// Mock Users list for admin
interface AdminUser {
    id: number
    name: string
    email: string
    role: string
    balance: number
    createdAt: string
}

export const mockUsers: AdminUser[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'User', balance: 156.78, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', balance: 450.25, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 3, name: 'Bob Wilson', email: 'bob.wilson@example.com', role: 'User', balance: 0, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, name: 'Admin User', email: 'admin@torreclou.com', role: 'Admin', balance: 1250.00, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 5, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'User', balance: 89.50, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
]

// Mock Admin Dashboard Analytics
export const mockAdminDashboardAnalytics = {
    totalUsers: 1250,
    totalRevenue: 45780.50,
    pendingDeposits: 12,
    activeJobs: 28,
    totalJobsCompleted: 8920,
    activeVouchers: 15,
    totalStorageUsedGb: 2450.5,
}

// ============================================
// Mock Storage Profiles
// ============================================

export const mockStorageProfiles: StorageProfile[] = [
    {
        id: 1,
        profileName: 'My Google Drive',
        providerType: StorageProviderType.GoogleDrive,
        isDefault: true,
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        profileName: 'Work OneDrive',
        providerType: StorageProviderType.OneDrive,
        isDefault: false,
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        profileName: 'Backup Dropbox',
        providerType: StorageProviderType.Dropbox,
        isDefault: false,
        isActive: false,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

// ============================================
// Mock Jobs
// ============================================

export const mockJobs: UserJob[] = [
    {
        id: 1,
        userId: 1,
        storageProfileId: 1,
        status: JobStatus.COMPLETED,
        type: JobType.Torrent,
        requestFileId: 1,
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        bytesDownloaded: 4800000000,
        totalBytes: 4800000000,
        selectedFileIndices: [0],
        progress: 100,
        fileName: 'Ubuntu 22.04.3 LTS Desktop',
        storageProfileName: 'My Google Drive',
    },
    {
        id: 2,
        userId: 1,
        storageProfileId: 1,
        status: JobStatus.PROCESSING,
        type: JobType.Torrent,
        requestFileId: 2,
        currentState: 'Downloading files...',
        startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lastHeartbeat: new Date().toISOString(),
        bytesDownloaded: 1200000000,
        totalBytes: 3500000000,
        selectedFileIndices: [0, 1, 2],
        progress: 34.3,
        fileName: 'Big Buck Bunny 4K',
        storageProfileName: 'My Google Drive',
    },
    {
        id: 3,
        userId: 1,
        storageProfileId: 1,
        status: JobStatus.UPLOADING,
        type: JobType.Torrent,
        requestFileId: 3,
        currentState: 'Uploading to Google Drive...',
        startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        lastHeartbeat: new Date().toISOString(),
        bytesDownloaded: 800000000,
        totalBytes: 800000000,
        selectedFileIndices: [0],
        progress: 85,
        fileName: 'Sintel 1080p',
        storageProfileName: 'My Google Drive',
    },
    {
        id: 4,
        userId: 1,
        storageProfileId: 2,
        status: JobStatus.QUEUED,
        type: JobType.Torrent,
        requestFileId: 4,
        bytesDownloaded: 0,
        totalBytes: 2100000000,
        selectedFileIndices: [0],
        progress: 0,
        fileName: 'Blender 4.0 Portable',
        storageProfileName: 'Work OneDrive',
    },
    {
        id: 5,
        userId: 1,
        storageProfileId: 1,
        status: JobStatus.FAILED,
        type: JobType.Torrent,
        requestFileId: 5,
        errorMessage: 'Connection timeout: Unable to connect to peers',
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        bytesDownloaded: 500000000,
        totalBytes: 5000000000,
        selectedFileIndices: [0, 1],
        progress: 10,
        fileName: 'LibreOffice 7.6',
        storageProfileName: 'My Google Drive',
    },
]

// ============================================
// Mock Vouchers
// ============================================

export const mockVouchers: Voucher[] = [
    {
        id: 1,
        code: 'WELCOME10',
        type: DiscountType.Percentage,
        value: 10,
        maxUsesTotal: 1000,
        maxUsesPerUser: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
    },
    {
        id: 2,
        code: 'SAVE5USD',
        type: DiscountType.FixedAmount,
        value: 5,
        maxUsesTotal: 500,
        maxUsesPerUser: 3,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
    },
]

// ============================================
// Mock Admin Data
// ============================================

export const mockAdminDeposits: AdminDeposit[] = [
    {
        id: 1,
        userId: 1,
        userEmail: 'john.doe@example.com',
        userFullName: 'John Doe',
        amount: 50.00,
        currency: 'USDT',
        paymentProvider: 'Crypto',
        gatewayTransactionId: 'TXN-001-ABC',
        status: DepositStatus.Completed,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    },
    {
        id: 2,
        userId: 3,
        userEmail: 'jane.smith@example.com',
        userFullName: 'Jane Smith',
        amount: 200.00,
        currency: 'USDC',
        paymentProvider: 'Crypto',
        gatewayTransactionId: 'TXN-002-DEF',
        status: DepositStatus.Completed,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
    },
    {
        id: 3,
        userId: 4,
        userEmail: 'bob.wilson@example.com',
        userFullName: 'Bob Wilson',
        amount: 75.00,
        currency: 'USDT',
        paymentProvider: 'Crypto',
        gatewayTransactionId: 'TXN-003-GHI',
        status: DepositStatus.Pending,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
]

export const mockAdminWallets: AdminWallet[] = [
    {
        userId: 1,
        userEmail: 'john.doe@example.com',
        userFullName: 'John Doe',
        balance: 156.78,
        transactionCount: 12,
        lastTransactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        userId: 3,
        userEmail: 'jane.smith@example.com',
        userFullName: 'Jane Smith',
        balance: 450.25,
        transactionCount: 28,
        lastTransactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        userId: 4,
        userEmail: 'bob.wilson@example.com',
        userFullName: 'Bob Wilson',
        balance: 0,
        transactionCount: 5,
        lastTransactionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

// Generate chart data points
const generateChartData = (days: number, baseAmount: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = []
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const variation = Math.random() * 0.5 + 0.75 // 75% to 125% of base
        data.push({
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Math.round(baseAmount * variation * 100) / 100,
            count: Math.floor(Math.random() * 20) + 5,
        })
    }
    return data
}

export const mockAdminDashboard: AdminDashboard = {
    totalDepositsAmount: 15750.50,
    totalDepositsCount: 245,
    pendingDepositsCount: 12,
    completedDepositsCount: 220,
    failedDepositsCount: 13,
    totalWalletBalance: 8920.75,
    totalUsersWithBalance: 156,
    dailyDeposits: generateChartData(7, 150),
    weeklyDeposits: generateChartData(4, 1050),
    monthlyDeposits: generateChartData(6, 4200),
}

// ============================================
// Pagination Helper
// ============================================

export function paginateData<T>(
    data: T[],
    pageNumber: number = 1,
    pageSize: number = 10
): PaginatedResult<T> {
    const totalCount = data.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    const items = data.slice(startIndex, endIndex)

    return {
        items,
        totalCount,
        pageNumber,
        pageSize,
        totalPages,
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
    }
}

// ============================================
// Stablecoin Minimum Amounts
// ============================================

export const stablecoinMinAmounts = [
    { currency: 'USDT', minAmount: 10, fiatEquivalent: '$10.00' },
    { currency: 'USDC', minAmount: 10, fiatEquivalent: '$10.00' },
    { currency: 'BUSD', minAmount: 10, fiatEquivalent: '$10.00' },
    { currency: 'DAI', minAmount: 15, fiatEquivalent: '$15.00' },
]
