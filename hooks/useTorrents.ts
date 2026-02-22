'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { analyzeTorrentFile, createJob, getTorrentErrorMessage } from '@/lib/api/torrents'
import { useTorrentStore } from '@/stores/torrentStore'
import type { TorrentAnalysisResponse, JobCreationResult } from '@/types/torrents'
import { extractApiError } from '@/lib/api/errors'
import { jobsKeys } from './useJobs'

// ============================================
// Query Keys
// ============================================

export const torrentKeys = {
    all: ['torrents'] as const,
    analysis: () => [...torrentKeys.all, 'analysis'] as const,
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
        mutationFn: async (file: File): Promise<TorrentAnalysisResponse> => {
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
 * Hook for starting a download
 * Calls createJob directly using torrentFileId from the analysis result
 */
export function useStartDownload() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { analysisResult, selectedFilePaths, selectedStorageProfileId, clearTorrentData } = useTorrentStore()

    return useMutation({
        mutationFn: async (): Promise<JobCreationResult> => {
            if (!analysisResult) {
                throw new Error('No analysis available')
            }
            if (selectedFilePaths.length === 0) {
                throw new Error('Please select at least one file')
            }
            if (!selectedStorageProfileId) {
                throw new Error('Please select a storage profile')
            }

            // Send all files as null (download all), otherwise send selected paths
            const filePaths = selectedFilePaths.length === analysisResult.files.length
                ? null
                : selectedFilePaths

            return createJob(
                analysisResult.torrentFileId,
                filePaths,
                selectedStorageProfileId
            )
        },
        onSuccess: () => {
            // Invalidate jobs query
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })

            // Clear torrent workflow data
            clearTorrentData()

            toast.success('Download started!')

            // Navigate to jobs page
            router.push('/jobs')
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}
