'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { analyzeTorrentFile, getTorrentAnalysis, createJob, getTorrentErrorMessage } from '@/lib/api/torrents'
import { useTorrentStore } from '@/stores/torrentStore'
import type { TorrentInfo, AnalyzeResponse, JobCreationResult } from '@/types/torrents'
import { extractApiError } from '@/lib/api/errors'
import { jobsKeys } from './useJobs'

// ============================================
// Query Keys
// ============================================

export const torrentKeys = {
    all: ['torrents'] as const,
    analysis: () => [...torrentKeys.all, 'analysis'] as const,
    analyze: () => [...torrentKeys.all, 'analyze'] as const,
}

// ============================================
// Error Handler
// ============================================

function handleTorrentError(error: unknown): string {
    const extracted = extractApiError(error)
    if (extracted.code) {
        return getTorrentErrorMessage(extracted.code)
    }
    return extracted.message
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for analyzing torrent files
 * Handles the upload → analyze → navigate flow
 */
export function useTorrentAnalysis() {
    const router = useRouter()
    const { setAnalysisResult, setTorrentFile } = useTorrentStore()

    return useMutation({
        mutationFn: async (file: File): Promise<TorrentInfo> => {
            return analyzeTorrentFile(file)
        },
        onSuccess: (data, file) => {
            // Store results in Zustand
            setTorrentFile(file)
            setAnalysisResult(data)

            toast.success('Torrent analyzed successfully!')
            router.push('/torrents/analyze')
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}

/**
 * Hook for analyzing torrent with selected files
 * Handles file selection → analyze request flow
 */
export function useTorrentAnalyze() {
    const { setAnalyzeResult, torrentFile, selectedFilePaths, selectedStorageProfileId } = useTorrentStore()

    return useMutation({
        mutationFn: async (): Promise<AnalyzeResponse> => {
            if (!torrentFile) {
                throw new Error('No torrent file available')
            }
            if (selectedFilePaths.length === 0) {
                throw new Error('Please select at least one file')
            }
            if (!selectedStorageProfileId) {
                throw new Error('Please select a storage profile')
            }
            return getTorrentAnalysis(torrentFile, selectedFilePaths, selectedStorageProfileId)
        },
        onSuccess: (data) => {
            // Store analyze result
            setAnalyzeResult(data)
            toast.success('Analysis complete!')
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}

/**
 * Hook for starting a download in a single step
 * Combines analyze + createJob into one operation
 */
export function useStartDownload() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { torrentFile, selectedFilePaths, selectedStorageProfileId, clearTorrentData } = useTorrentStore()

    return useMutation({
        mutationFn: async (): Promise<JobCreationResult> => {
            if (!torrentFile) {
                throw new Error('No torrent file available')
            }
            if (selectedFilePaths.length === 0) {
                throw new Error('Please select at least one file')
            }
            if (!selectedStorageProfileId) {
                throw new Error('Please select a storage profile')
            }

            // Step 1: Analyze to get torrentFileId
            const analyzeResult = await getTorrentAnalysis(
                torrentFile,
                selectedFilePaths,
                selectedStorageProfileId
            )

            // Step 2: Create job with that ID
            return createJob(
                analyzeResult.torrentFileId,
                analyzeResult.selectedFiles,
                selectedStorageProfileId
            )
        },
        onSuccess: (data) => {
            // Invalidate jobs query
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })

            // Clear torrent workflow data
            clearTorrentData()

            // Show success message
            if (data.hasStorageProfileWarning && data.storageProfileWarningMessage) {
                toast.warning(data.storageProfileWarningMessage)
            } else {
                toast.success('Download started!')
            }

            // Navigate to jobs page
            router.push('/jobs')
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}

/**
 * Hook for creating a job directly from a quote
 * Handles quote → job creation → navigation flow
 * @deprecated Use useStartDownload instead which combines analyze + createJob
 */
export function useCreateJob() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { clearTorrentData, analyzeResult, selectedStorageProfileId } = useTorrentStore()

    return useMutation({
        mutationFn: async (): Promise<JobCreationResult> => {
            if (!analyzeResult) {
                throw new Error('No analysis available')
            }
            return createJob(
                analyzeResult.torrentFileId,
                analyzeResult.selectedFiles,
                selectedStorageProfileId || undefined
            )
        },
        onSuccess: (data) => {
            // Invalidate jobs query
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })

            // Clear torrent workflow data
            clearTorrentData()

            // Show success message
            if (data.hasStorageProfileWarning && data.storageProfileWarningMessage) {
                toast.warning(data.storageProfileWarningMessage)
            } else {
                toast.success('Job created successfully!')
            }

            // Navigate to jobs page
            router.push('/jobs')
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}
