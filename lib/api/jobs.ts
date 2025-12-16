// Jobs API client with Zod validation
import apiClient from '../axios'
import {
    jobSchema,
    paginatedJobsSchema,
} from '@/types/jobs'
import type {
    Job,
    PaginatedJobs,
    JobsQueryParams,
} from '@/types/jobs'

// Re-export types for convenience
export type { Job, PaginatedJobs, JobsQueryParams }
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
    return paginatedJobsSchema.parse(response.data)
}

/**
 * Get a specific job by ID
 */
export async function getJob(jobId: number): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${jobId}`)
    return jobSchema.parse(response.data)
}
