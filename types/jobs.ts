// Jobs Types with Zod Validation
import { z } from 'zod'
import { JobStatus, JobType } from './enums'
import type { UserJob } from './api'

// ============================================
// Zod Schemas
// ============================================

// Map of numeric enum values to string values (matching backend enum order)
const jobStatusNumberMap: Record<number, string> = {
    0: 'QUEUED',
    1: 'DOWNLOADING',
    2: 'SYNCING',
    3: 'PENDING_UPLOAD',
    4: 'UPLOADING',
    5: 'RETRYING',
    6: 'TORRENT_DOWNLOAD_RETRY',
    7: 'UPLOAD_RETRY',
    8: 'SYNC_RETRY',
    9: 'COMPLETED',
    10: 'FAILED',
    11: 'CANCELLED',
    12: 'TORRENT_FAILED',
    13: 'UPLOAD_FAILED',
    14: 'GOOGLE_DRIVE_FAILED',
}

const validStatusStrings = [
    'QUEUED',
    'DOWNLOADING',
    'SYNCING',
    'PENDING_UPLOAD',
    'UPLOADING',
    'RETRYING',
    'TORRENT_DOWNLOAD_RETRY',
    'UPLOAD_RETRY',
    'SYNC_RETRY',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'TORRENT_FAILED',
    'UPLOAD_FAILED',
    'GOOGLE_DRIVE_FAILED',
] as const

// Schema that accepts both numeric enum values and string values
export const jobStatusSchema = z.preprocess(
    (val) => {
        // If it's a number, convert to string using the map
        if (typeof val === 'number') {
            return jobStatusNumberMap[val] ?? val
        }
        // If it's a string that represents a number, convert it
        if (typeof val === 'string' && /^\d+$/.test(val)) {
            const numVal = parseInt(val, 10)
            return jobStatusNumberMap[numVal] ?? val
        }
        // If it's already a string, return as-is
        return val
    },
    z.enum(validStatusStrings)
)

export const jobTypeSchema = z.enum(['Torrent', 'Sync'])

export const jobSchema = z.object({
    id: z.number().int().positive(),
    storageProfileId: z.number().int().positive(),
    storageProfileName: z.string().nullable(),
    status: jobStatusSchema,
    type: jobTypeSchema,
    requestFileId: z.number().int().positive(),
    requestFileName: z.string().nullable(),
    errorMessage: z.string().nullable(),
    currentState: z.string().nullable(),
    // Admin-only: Last heartbeat from worker processing the job
    lastHeartbeat: z.string().datetime().nullable().optional(),
    bytesDownloaded: z.number().int().nonnegative(),
    totalBytes: z.number().int().nonnegative(),
    selectedFileIndices: z.array(z.number().int().nonnegative()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable().optional(),
    startedAt: z.string().datetime().nullable().optional(),
    completedAt: z.string().datetime().nullable().optional(),
    progressPercentage: z.number().min(0).max(100),
    isActive: z.boolean(),
})

export const paginatedJobsSchema = z.object({
    items: z.array(jobSchema),
    totalCount: z.number().int().nonnegative(),
    pageNumber: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
})

export const jobStatisticsSchema = z.object({
    totalJobs: z.number().int().nonnegative(),
    activeJobs: z.number().int().nonnegative(),
    completedJobs: z.number().int().nonnegative(),
    failedJobs: z.number().int().nonnegative(),
    downloadingJobs: z.number().int().nonnegative().optional(),
})

export const jobsQueryParamsSchema = z.object({
    pageNumber: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().min(1).max(50).optional(),
    status: jobStatusSchema.nullable().optional(),
})

// ============================================
// Inferred Types from Schemas
// ============================================

export type Job = z.infer<typeof jobSchema>
export type PaginatedJobs = z.infer<typeof paginatedJobsSchema>
export type JobStatistics = z.infer<typeof jobStatisticsSchema>

// Manual type for query params (avoiding Zod default inference issues)
export interface JobsQueryParams {
    pageNumber?: number
    pageSize?: number
    status?: 'QUEUED' | 'DOWNLOADING' | 'SYNCING' | 'PENDING_UPLOAD' | 'UPLOADING' | 'RETRYING' | 'TORRENT_DOWNLOAD_RETRY' | 'UPLOAD_RETRY' | 'SYNC_RETRY' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TORRENT_FAILED' | 'UPLOAD_FAILED' | 'GOOGLE_DRIVE_FAILED' | null
}

// ============================================
// Component Props Types
// ============================================

export interface JobCardProps {
    job: UserJob
    className?: string
}

export interface JobListProps {
    jobs: UserJob[]
    title?: string
    limit?: number
    showViewAll?: boolean
    emptyMessage?: string
    className?: string
}

export interface JobDetailProps {
    job: Job
    className?: string
}

export interface JobsFiltersProps {
    className?: string
}

export interface JobsListProps {
    className?: string
}

export interface JobsPaginationProps {
    className?: string
}

// ============================================
// Status Labels and Colors
// ============================================

export const statusLabels: Record<JobStatus, string> = {
    [JobStatus.QUEUED]: 'Queued',
    [JobStatus.DOWNLOADING]: 'Downloading',
    [JobStatus.SYNCING]: 'Syncing to storage',
    [JobStatus.PENDING_UPLOAD]: 'Pending Upload',
    [JobStatus.UPLOADING]: 'Uploading',
    [JobStatus.RETRYING]: 'Retrying',
    [JobStatus.TORRENT_DOWNLOAD_RETRY]: 'Retrying download',
    [JobStatus.UPLOAD_RETRY]: 'Retrying upload',
    [JobStatus.SYNC_RETRY]: 'Retrying sync',
    [JobStatus.COMPLETED]: 'Completed',
    [JobStatus.FAILED]: 'Failed',
    [JobStatus.CANCELLED]: 'Cancelled',
    [JobStatus.TORRENT_FAILED]: 'Download failed',
    [JobStatus.UPLOAD_FAILED]: 'Upload failed',
    [JobStatus.GOOGLE_DRIVE_FAILED]: 'Google Drive upload failed',
}

// ============================================
// Error Messages
// ============================================

export const jobsErrorMessages: Record<string, string> = {
    'NOT_FOUND': 'Job not found.',
    'UNAUTHORIZED': 'You are not authorized to view this job.',
    'FETCH_ERROR': 'Failed to fetch jobs. Please try again.',
}

export function getJobsErrorMessage(code: string, fallback?: string): string {
    return jobsErrorMessages[code] || fallback || 'An unexpected error occurred'
}
