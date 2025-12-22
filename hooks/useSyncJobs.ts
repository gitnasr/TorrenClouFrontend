// React Query hooks for Admin Sync Jobs

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
    getSyncJobs,
    getSyncJob,
    getSyncJobStatistics,
} from '@/lib/api/sync-jobs'
import type {
    SyncJob,
    PaginatedSyncJobs,
    SyncJobsQueryParams,
    SyncJobStatistics,
} from '@/types/sync-jobs'
import { SyncStatus } from '@/types/enums'

// Query keys
export const syncJobsKeys = {
    all: ['syncJobs'] as const,
    lists: () => [...syncJobsKeys.all, 'list'] as const,
    list: (params: SyncJobsQueryParams) => [...syncJobsKeys.lists(), params] as const,
    details: () => [...syncJobsKeys.all, 'detail'] as const,
    detail: (id: number) => [...syncJobsKeys.details(), id] as const,
    statistics: () => [...syncJobsKeys.all, 'statistics'] as const,
}

/**
 * Hook to fetch paginated list of sync jobs (Admin only)
 */
export function useSyncJobs(params: SyncJobsQueryParams = {}) {
    return useQuery<PaginatedSyncJobs, Error>({
        queryKey: syncJobsKeys.list(params),
        queryFn: () => getSyncJobs(params),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 10 * 1000, // Refetch every 10 seconds for active sync jobs
    })
}

/**
 * Hook to fetch a single sync job by ID (Admin only)
 */
export function useSyncJob(syncJobId: number | null | undefined) {
    return useQuery<SyncJob, Error>({
        queryKey: syncJobsKeys.detail(syncJobId!),
        queryFn: () => getSyncJob(syncJobId!),
        enabled: !!syncJobId,
        staleTime: 10 * 1000, // 10 seconds
        refetchInterval: (query) => {
            // Refetch frequently if job is active
            const data = query.state.data
            if (data && (data.status === SyncStatus.SYNCING || data.status === SyncStatus.SYNC_RETRY)) {
                return 5 * 1000 // Every 5 seconds
            }
            return false // No auto-refetch for completed/failed
        },
    })
}

/**
 * Hook to fetch sync job statistics (Admin only)
 */
export function useSyncJobStatistics() {
    return useQuery<SyncJobStatistics, Error>({
        queryKey: syncJobsKeys.statistics(),
        queryFn: () => getSyncJobStatistics(),
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
    })
}
