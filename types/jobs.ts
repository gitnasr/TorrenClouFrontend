// Jobs Types with Zod Validation
import { z } from 'zod'
import { JobStatus, JobType } from './enums'
import type { UserJob } from './api'

// ============================================
// Zod Schemas
// ============================================

export const jobStatusSchema = z.enum([
    'QUEUED',
    'PROCESSING',
    'UPLOADING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
])

export const jobTypeSchema = z.enum(['Torrent', 'Other'])

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
    startedAt: z.string().nullable(),
    completedAt: z.string().nullable(),
    lastHeartbeat: z.string().nullable(),
    bytesDownloaded: z.number().int().nonnegative(),
    totalBytes: z.number().int().nonnegative(),
    selectedFileIndices: z.array(z.number().int().nonnegative()),
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
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
    status?: 'QUEUED' | 'PROCESSING' | 'UPLOADING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | null
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
    [JobStatus.PROCESSING]: 'Processing',
    [JobStatus.UPLOADING]: 'Uploading',
    [JobStatus.COMPLETED]: 'Completed',
    [JobStatus.FAILED]: 'Failed',
    [JobStatus.CANCELLED]: 'Cancelled',
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
