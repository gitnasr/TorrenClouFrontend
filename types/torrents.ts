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
// Analyze Response Schema
// ============================================

export const analyzeResponseSchema = z.object({
    fileName: z.string(),
    sizeInBytes: z.number(),
    infoHash: z.string(),
    torrentHealth: torrentHealthMeasurementsSchema,
    torrentFileId: z.number(),
    selectedFiles: z.array(z.string()),
    message: z.string().nullable().optional(),
})

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>

// ============================================
// Create Job Request Schema
// ============================================

export const createJobRequestSchema = z.object({
    torrentFileId: z.number(),
    selectedFilePaths: z.array(z.string()).nullable().optional(),
    storageProfileId: z.number().optional(),
})

export type CreateJobRequest = z.infer<typeof createJobRequestSchema>

// ============================================
// Job Creation Result Schema
// ============================================

export const jobCreationResultSchema = z.object({
    jobId: z.number(),
    storageProfileId: z.number().optional(),
    hasStorageProfileWarning: z.boolean(),
    storageProfileWarningMessage: z.string().nullable().optional(),
})

export type JobCreationResult = z.infer<typeof jobCreationResultSchema>

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
    TORRENT_FILE_NOT_FOUND: 'Torrent file not found',
    STORAGE_PROFILE_NOT_FOUND: 'Storage profile not found',
    UNAUTHORIZED: 'Please sign in to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
}

export function getTorrentErrorMessage(code: string): string {
    return torrentErrorMessages[code] || 'An unexpected error occurred. Please try again.'
}
