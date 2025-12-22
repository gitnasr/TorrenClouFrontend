// Sync Jobs Types - Admin only
// These are internal system jobs for syncing files to cloud storage

import { z } from 'zod'
import { SyncStatus } from './enums'

/**
 * Sync job schema - represents an internal sync operation
 */
export const syncJobSchema = z.object({
    id: z.number().int().positive(),
    jobId: z.number().int().positive(), // Related torrent job
    status: z.nativeEnum(SyncStatus),
    sourceType: z.string(), // e.g., "LocalDisk", "RcloneMount"
    destinationType: z.string(), // e.g., "GoogleDrive", "S3"
    totalBytes: z.number().int().nonnegative(),
    bytesTransferred: z.number().int().nonnegative(),
    progress: z.number().min(0).max(100),
    retryCount: z.number().int().nonnegative().default(0),
    errorMessage: z.string().nullable().optional(),
    createdAt: z.string(),
    startedAt: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    nextRetryAt: z.string().nullable().optional(),
    // Related job info
    requestFileName: z.string().nullable().optional(),
    storageProfileName: z.string().nullable().optional(),
})

export type SyncJob = z.infer<typeof syncJobSchema>

/**
 * Sync job statistics schema
 */
export const syncJobStatisticsSchema = z.object({
    totalJobs: z.number().int().nonnegative(),
    notStarted: z.number().int().nonnegative(),
    syncing: z.number().int().nonnegative(),
    retrying: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    totalBytesTransferred: z.number().int().nonnegative().optional(),
    averageTransferTimeMs: z.number().nonnegative().optional(),
})

export type SyncJobStatistics = z.infer<typeof syncJobStatisticsSchema>

/**
 * Paginated sync jobs schema
 */
export const paginatedSyncJobsSchema = z.object({
    items: z.array(syncJobSchema),
    totalCount: z.number().int().nonnegative(),
    pageNumber: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
})

export type PaginatedSyncJobs = z.infer<typeof paginatedSyncJobsSchema>

/**
 * Query params for sync jobs list
 */
export interface SyncJobsQueryParams {
    pageNumber?: number
    pageSize?: number
    status?: SyncStatus
}

/**
 * Status labels for display
 */
export const syncStatusLabels: Record<SyncStatus, string> = {
    [SyncStatus.NOT_STARTED]: 'Not Started',
    [SyncStatus.SYNCING]: 'Syncing',
    [SyncStatus.SYNC_RETRY]: 'Retrying',
    [SyncStatus.COMPLETED]: 'Completed',
    [SyncStatus.FAILED]: 'Failed',
}
