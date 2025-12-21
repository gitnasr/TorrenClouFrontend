// Jobs API client with Zod validation
import apiClient from '../axios'
import {
    jobSchema,
    paginatedJobsSchema,
    jobStatisticsSchema,
} from '@/types/jobs'
import type {
    Job,
    PaginatedJobs,
    JobsQueryParams,
    JobStatistics,
} from '@/types/jobs'

// Re-export types for convenience
export type { Job, PaginatedJobs, JobsQueryParams, JobStatistics }
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

