// Jobs API client with Zod validation
import { z } from 'zod'
import apiClient from '../axios'
import {
    jobSchema,
    paginatedJobsSchema,
    jobStatisticsSchema,
    jobTimelineEntrySchema,
} from '@/types/jobs'
import type {
    Job,
    PaginatedJobs,
    JobsQueryParams,
    JobStatistics,
    JobTimelineEntry,
} from '@/types/jobs'

// Re-export types for convenience
export type { Job, PaginatedJobs, JobsQueryParams, JobStatistics, JobTimelineEntry }
export { getJobsErrorMessage, jobsErrorMessages } from '@/types/jobs'

/**
 * Get all jobs for the current user with pagination and optional status filter
 */
export async function getJobs(params: JobsQueryParams = {}): Promise<PaginatedJobs> {
    const searchParams = new URLSearchParams()

    if (params.pageNumber) {
        searchParams.set('pageNumber', params.pageNumber.toString())
    }
    if (params.pageSize) {
        searchParams.set('pageSize', params.pageSize.toString())
    }
    if (params.status) {
        searchParams.set('status', params.status)
    }

    const url = `/jobs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await apiClient.get<PaginatedJobs>(url)
    
    try {
        return paginatedJobsSchema.parse(response.data)
    } catch (error) {
        // Log validation errors for debugging
        console.error('Job list validation error:', error)
        throw new Error('Invalid job data received from server. Please try again later.')
    }
}

/**
 * Get a specific job by ID
 */
export async function getJob(jobId: number): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${jobId}`)
    
    try {
        return jobSchema.parse(response.data)
    } catch (error) {
        // Log validation errors for debugging
        console.error('Job detail validation error:', error)
        throw new Error('Invalid job data received from server. Please try again later.')
    }
}

/**
 * Get job statistics (total, active, completed, failed counts)
 */
export async function getJobStatistics(): Promise<JobStatistics> {
    const response = await apiClient.get<JobStatistics>('/jobs/statistics')
    
    try {
        return jobStatisticsSchema.parse(response.data)
    } catch (error) {
        // Log validation errors for debugging
        console.error('Job statistics validation error:', error)
        throw new Error('Invalid statistics data received from server. Please try again later.')
    }
}

/**
 * Get job timeline (complete history of status changes)
 * GET /api/jobs/{id}/timeline
 */
export async function getJobTimeline(jobId: number): Promise<JobTimelineEntry[]> {
    const response = await apiClient.get<JobTimelineEntry[]>(`/jobs/${jobId}/timeline`)
    
    try {
        // Validate array of timeline entries
        const entries = z.array(jobTimelineEntrySchema).parse(response.data)
        return entries
    } catch (error) {
        // Log validation errors for debugging
        console.error('Job timeline validation error:', error)
        throw new Error('Invalid timeline data received from server. Please try again later.')
    }
}

// ============================================
// Job Action Response Type
// ============================================

export interface JobActionResponse {
    isSuccess: boolean
    value?: boolean
    error?: {
        code: string
        message: string
    }
}

// ============================================
// User Job Actions
// ============================================

/**
 * Retry a failed job
 * POST /api/jobs/{id}/retry
 */
export async function retryJob(jobId: number): Promise<JobActionResponse> {
    const response = await apiClient.post<JobActionResponse>(`/jobs/${jobId}/retry`)
    return response.data
}

/**
 * Cancel an active job
 * POST /api/jobs/{id}/cancel
 */
export async function cancelJob(jobId: number): Promise<JobActionResponse> {
    const response = await apiClient.post<JobActionResponse>(`/jobs/${jobId}/cancel`)
    return response.data
}
