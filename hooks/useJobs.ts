'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getJobs, getJob } from '@/lib/api/jobs'
import { useJobsStore } from '@/stores/jobsStore'
import type { JobsQueryParams, PaginatedJobs, Job } from '@/types/jobs'
import { paginatedJobsSchema, jobSchema } from '@/types/jobs'

// ============================================
// Query Keys
// ============================================

export const jobsKeys = {
    all: ['jobs'] as const,
    lists: () => [...jobsKeys.all, 'list'] as const,
    list: (params: JobsQueryParams) => [...jobsKeys.lists(), params] as const,
    details: () => [...jobsKeys.all, 'detail'] as const,
    detail: (id: number) => [...jobsKeys.details(), id] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch paginated jobs list
 * Auto-refetches every 3 seconds if there are active jobs
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
        refetchInterval: (query) => {
            // Auto-refetch every 3 seconds if there are active jobs
            const data = query.state.data as PaginatedJobs | undefined
            const hasActiveJobs = data?.items.some((job) => job.isActive) ?? false
            return hasActiveJobs ? 3000 : false
        },
    })
}

/**
 * Hook to fetch a specific job by ID
 * Auto-refetches every 2 seconds if job is active
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
        refetchInterval: (query) => {
            // Auto-refetch every 2 seconds if job is active
            const data = query.state.data as Job | undefined
            return data?.isActive ? 2000 : false
        },
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
