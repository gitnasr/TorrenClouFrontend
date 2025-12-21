'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getJobs, getJob, getJobStatistics } from '@/lib/api/jobs'
import { useJobsStore } from '@/stores/jobsStore'
import type { JobsQueryParams, PaginatedJobs, Job, JobStatistics } from '@/types/jobs'
import { paginatedJobsSchema, jobSchema, jobStatisticsSchema } from '@/types/jobs'

// ============================================
// Query Keys
// ============================================

export const jobsKeys = {
    all: ['jobs'] as const,
    lists: () => [...jobsKeys.all, 'list'] as const,
    list: (params: JobsQueryParams) => [...jobsKeys.lists(), params] as const,
    details: () => [...jobsKeys.all, 'detail'] as const,
    detail: (id: number) => [...jobsKeys.details(), id] as const,
    statistics: () => [...jobsKeys.all, 'statistics'] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch paginated jobs list
 * Uses default React Query behavior (refetch on window focus, reconnect, etc.)
 */
export function useJobs() {
    const { status } = useSession()
    const { currentPage, pageSize, selectedStatus } = useJobsStore()

    return useQuery({
        queryKey: jobsKeys.list({ pageNumber: currentPage, pageSize, status: selectedStatus }),
        queryFn: async () => {
            const data = await getJobs({
                pageNumber: currentPage,
                pageSize,
                status: selectedStatus,
            })
            // Validate with Zod
            return paginatedJobsSchema.parse(data)
        },
        enabled: status === 'authenticated',
        staleTime: 5 * 1000, // 5 seconds - jobs update frequently
    })
}

/**
 * Hook to fetch a specific job by ID
 * Uses default React Query behavior (refetch on window focus, reconnect, etc.)
 */
export function useJob(jobId: number | null) {
    const { status } = useSession()

    return useQuery({
        queryKey: jobsKeys.detail(jobId ?? 0),
        queryFn: async () => {
            if (!jobId) {
                throw new Error('Invalid job ID')
            }
            const data = await getJob(jobId)
            // Validate with Zod
            return jobSchema.parse(data)
        },
        enabled: status === 'authenticated' && !!jobId,
        staleTime: 2 * 1000, // 2 seconds - job details update frequently
    })
}

/**
 * Hook to fetch job statistics
 * Uses default React Query behavior (refetch on window focus, reconnect, etc.)
 */
export function useJobStatistics() {
    const { status } = useSession()

    return useQuery({
        queryKey: jobsKeys.statistics(),
        queryFn: async () => {
            const data = await getJobStatistics()
            // Validate with Zod
            return jobStatisticsSchema.parse(data)
        },
        enabled: status === 'authenticated',
        staleTime: 10 * 1000, // 10 seconds
    })
}

/**
 * Hook to prefetch the next page of jobs
 */
export function usePrefetchNextPage() {
    const queryClient = useQueryClient()
    const { currentPage, pageSize, selectedStatus } = useJobsStore()

    return (hasNextPage: boolean) => {
        if (hasNextPage) {
            queryClient.prefetchQuery({
                queryKey: jobsKeys.list({
                    pageNumber: currentPage + 1,
                    pageSize,
                    status: selectedStatus
                }),
                queryFn: () => getJobs({
                    pageNumber: currentPage + 1,
                    pageSize,
                    status: selectedStatus,
                }),
            })
        }
    }
}

