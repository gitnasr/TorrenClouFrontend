'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
    getJobs,
    getJob,
    getJobStatistics,
    getJobTimeline,
    retryJob,
    cancelJob,
} from '@/lib/api/jobs'
import { useJobsStore } from '@/stores/jobsStore'
import type { JobsQueryParams } from '@/types/jobs'
import { paginatedJobsSchema, jobSchema, jobStatisticsSchema, jobTimelineEntrySchema, getJobsErrorMessage } from '@/types/jobs'
import { extractApiError } from '@/lib/api/errors'
import { z } from 'zod'

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
    timelines: () => [...jobsKeys.all, 'timeline'] as const,
    timeline: (id: number) => [...jobsKeys.timelines(), id] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch paginated jobs list
 * Enhanced with refetch on focus, reconnect, and polling for active jobs
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
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        // Poll every 10 seconds if there are active jobs
        refetchInterval: (query) => {
            const data = query.state.data
            if (!data) return false
            const hasActiveJobs = data.items.some(job => 
                ['QUEUED', 'DOWNLOADING', 'PENDING_UPLOAD', 'UPLOADING', 'TORRENT_DOWNLOAD_RETRY', 'UPLOAD_RETRY'].includes(job.status)
            )
            return hasActiveJobs ? 10 * 1000 : false
        },
    })
}

/**
 * Hook to fetch a specific job by ID
 * Enhanced with refetch on focus, reconnect, and polling for active jobs
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
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        // Poll every 5 seconds if job is active
        refetchInterval: (query) => {
            const data = query.state.data
            if (!data) return false
            const isActive = ['QUEUED', 'DOWNLOADING', 'PENDING_UPLOAD', 'UPLOADING', 'TORRENT_DOWNLOAD_RETRY', 'UPLOAD_RETRY'].includes(data.status)
            return isActive ? 5 * 1000 : false
        },
    })
}

/**
 * Hook to fetch job statistics
 * Enhanced with refetch on focus
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
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    })
}

/**
 * Hook to fetch job timeline
 * Enhanced with refetch on focus, reconnect, and polling for active jobs
 */
export function useJobTimeline(jobId: number | null) {
    const { status } = useSession()
    
    // Get job data to check if it's active
    const { data: jobData } = useJob(jobId)

    return useQuery({
        queryKey: jobsKeys.timeline(jobId ?? 0),
        queryFn: async () => {
            if (!jobId) {
                throw new Error('Invalid job ID')
            }
            const data = await getJobTimeline(jobId)
            // Validate with Zod
            return z.array(jobTimelineEntrySchema).parse(data)
        },
        enabled: status === 'authenticated' && !!jobId,
        staleTime: 5 * 1000, // 5 seconds - timeline updates when job status changes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        // Poll every 10 seconds only if job is active
        refetchInterval: () => {
            if (!jobData) return false
            const isActive = ['QUEUED', 'DOWNLOADING', 'PENDING_UPLOAD', 'UPLOADING', 'TORRENT_DOWNLOAD_RETRY', 'UPLOAD_RETRY'].includes(jobData.status)
            return isActive ? 10 * 1000 : false
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

// ============================================
// Error Handler
// ============================================

function handleJobActionError(error: unknown): string {
    const extracted = extractApiError(error)
    if (extracted.code) {
        return getJobsErrorMessage(extracted.code, extracted.message)
    }
    return extracted.message
}

// ============================================
// Job Action Mutation Hooks
// ============================================

/**
 * Hook for retrying a failed job
 */
export function useRetryJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: retryJob,
        onSuccess: () => {
            // Invalidate job queries to refresh data
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })
            toast.success('Job retry initiated successfully')
        },
        onError: (error) => {
            const message = handleJobActionError(error)
            toast.error('Failed to retry job', { description: message })
        },
    })
}

/**
 * Hook for cancelling an active job
 */
export function useCancelJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cancelJob,
        onSuccess: () => {
            // Invalidate job queries to refresh data
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })
            toast.success('Job cancelled successfully')
        },
        onError: (error) => {
            const message = handleJobActionError(error)
            toast.error('Failed to cancel job', { description: message })
        },
    })
}
