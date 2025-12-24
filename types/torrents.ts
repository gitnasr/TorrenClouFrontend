// Torrent API types with Zod validation schemas
import { z } from 'zod'

// ============================================
// Scrape Result Schema
// ============================================

export const scrapeAggregationResultSchema = z.object({
    seeders: z.number(),
    leechers: z.number(),
    completed: z.number(),
    trackersSuccess: z.number(),
    trackersTotal: z.number(),
})

export type ScrapeAggregationResult = z.infer<typeof scrapeAggregationResultSchema>

// ============================================
// Torrent File Schema
// ============================================

export const torrentFileSchema = z.object({
    index: z.number(),
    path: z.string(),
    size: z.number(),
})

export type TorrentFileDto = z.infer<typeof torrentFileSchema>

// ============================================
// Torrent Health Measurements Schema
// ============================================

export const torrentHealthMeasurementsSchema = z.object({
    seeders: z.number(),
    leechers: z.number(),
    completed: z.number(),
    seederRatio: z.number(),
    isComplete: z.boolean(),
    isDead: z.boolean(),
    isWeak: z.boolean(),
    isHealthy: z.boolean(),
    healthScore: z.number(),
})

export type TorrentHealthMeasurements = z.infer<typeof torrentHealthMeasurementsSchema>

// ============================================
// Torrent Info (Analysis Response) Schema
// ============================================

export const torrentInfoSchema = z.object({
    infoHash: z.string(),
    name: z.string(),
    totalSize: z.number(),
    files: z.array(torrentFileSchema),
    trackers: z.array(z.string()),
    scrapeResult: scrapeAggregationResultSchema,
    healthScore: z.number().optional(),
    healthMultiplier: z.number().optional(),
    health: torrentHealthMeasurementsSchema.optional(),
})

export type TorrentInfo = z.infer<typeof torrentInfoSchema>

// ============================================
// Pricing Snapshot Schema
// ============================================

export const pricingSnapshotSchema = z.object({
    totalSizeInBytes: z.number(),
    totalSizeInGb: z.number(), // Computed property: totalSizeInBytes / 1_073_741_824.0
    calculatedSizeInGb: z.number(),
    selectedFiles: z.array(z.string()),
    baseRatePerGb: z.number(),
    userRegion: z.string(),
    regionMultiplier: z.number(),
    healthMultiplier: z.number(),
    isCacheHit: z.boolean(),
    cacheDiscountAmount: z.number(),
    finalPrice: z.number(),
    calculatedAt: z.string(),
})

export type PricingSnapshot = z.infer<typeof pricingSnapshotSchema>

// ============================================
// Quote Response Schema
// ============================================

export const quoteResponseSchema = z.object({
    isReadyToDownload: z.boolean(),
    originalAmountInUSD: z.number(),
    finalAmountInUSD: z.number(),
    finalAmountInNCurrency: z.number(),
    torrentHealth: torrentHealthMeasurementsSchema,
    fileName: z.string(),
    sizeInBytes: z.number(),
    isCached: z.boolean(),
    infoHash: z.string(),
    message: z.string().nullable().optional(),
    pricingDetails: pricingSnapshotSchema,
    invoiceId: z.number(),
})

export type QuoteResponse = z.infer<typeof quoteResponseSchema>

// ============================================
// Invoice Payment Result Schema
// ============================================

export const invoicePaymentResultSchema = z.object({
    walletTransaction: z.number(),
    invoiceId: z.number(),
    jobId: z.number(),
    totalAmountInNCurruncy: z.number(), // Note: typo matches backend
    hasStorageProfileWarning: z.boolean(),
    storageProfileWarningMessage: z.string().nullable().optional(),
})

export type InvoicePaymentResult = z.infer<typeof invoicePaymentResultSchema>

// ============================================
// Wallet Balance Schema
// ============================================

export const walletBalanceSchema = z.object({
    balance: z.number(),
    currency: z.string(),
})

export type WalletBalanceDto = z.infer<typeof walletBalanceSchema>

// ============================================
// API Error Response Schema
// ============================================

export const apiErrorResponseSchema = z.object({
    code: z.string(),
    message: z.string(),
})

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>

// ============================================
// Error Messages
// ============================================

export const torrentErrorMessages: Record<string, string> = {
    INVALID_TORRENT_FILE: 'The uploaded file is not a valid torrent file',
    VALIDATION_ERROR: 'Request validation failed',
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance to complete this payment',
    INVOICE_NOT_FOUND: 'Invoice not found',
    INVOICE_EXPIRED: 'This invoice has expired. Please get a new quote.',
    INVOICE_ALREADY_PAID: 'This invoice has already been paid',
    UNAUTHORIZED: 'Please sign in to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
}

export function getTorrentErrorMessage(code: string): string {
    return torrentErrorMessages[code] || 'An unexpected error occurred. Please try again.'
}
