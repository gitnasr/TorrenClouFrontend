// Admin Sync Jobs API client
// Endpoints: /api/admin/jobs/sync

import apiClient from '../axios'
import {
    syncJobSchema,
    paginatedSyncJobsSchema,
    syncJobStatisticsSchema,
} from '@/types/sync-jobs'
import type {
    SyncJob,
    PaginatedSyncJobs,
    SyncJobsQueryParams,
    SyncJobStatistics,
} from '@/types/sync-jobs'

// Re-export types for convenience
export type { SyncJob, PaginatedSyncJobs, SyncJobsQueryParams, SyncJobStatistics }

/**
 * Get all sync jobs with pagination and optional status filter (Admin only)
 */
export async function getSyncJobs(params: SyncJobsQueryParams = {}): Promise<PaginatedSyncJobs> {
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

    const url = `/admin/jobs/sync${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await apiClient.get<PaginatedSyncJobs>(url)

    try {
        return paginatedSyncJobsSchema.parse(response.data)
    } catch (error) {
        console.error('Sync jobs list validation error:', error)
        throw new Error('Invalid sync jobs data received from server.')
    }
}

/**
 * Get a specific sync job by ID (Admin only)
 */
export async function getSyncJob(syncJobId: number): Promise<SyncJob> {
    const response = await apiClient.get<SyncJob>(`/admin/jobs/sync/${syncJobId}`)

    try {
        return syncJobSchema.parse(response.data)
    } catch (error) {
        console.error('Sync job detail validation error:', error)
        throw new Error('Invalid sync job data received from server.')
    }
}

/**
 * Get sync job statistics (Admin only)
 */
export async function getSyncJobStatistics(): Promise<SyncJobStatistics> {
    const response = await apiClient.get<SyncJobStatistics>('/admin/jobs/sync/statistics')

    try {
        return syncJobStatisticsSchema.parse(response.data)
    } catch (error) {
        console.error('Sync job statistics validation error:', error)
        throw new Error('Invalid statistics data received from server.')
    }
}
