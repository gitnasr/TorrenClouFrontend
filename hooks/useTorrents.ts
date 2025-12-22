'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { analyzeTorrentFile, getTorrentQuote, getTorrentErrorMessage } from '@/lib/api/torrents'
import { useTorrentStore } from '@/stores/torrentStore'
import type { TorrentInfo, QuoteResponse } from '@/types/torrents'
import { AxiosError } from 'axios'

// ============================================
// Query Keys
// ============================================

export const torrentKeys = {
    all: ['torrents'] as const,
    analysis: () => [...torrentKeys.all, 'analysis'] as const,
    quote: () => [...torrentKeys.all, 'quote'] as const,
}

// ============================================
// Error Handler
// ============================================

interface ApiError {
    code?: string
    message?: string
}

function handleTorrentError(error: unknown): string {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ApiError
        if (data.code) {
            return getTorrentErrorMessage(data.code)
        }
        if (data.message) {
            return data.message
        }
    }
    if (error instanceof Error) {
        return error.message
    }
    return 'An unexpected error occurred'
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
 * Hook for getting torrent quotes
 * Handles file selection → quote request → redirect to invoice flow
 */
export function useTorrentQuote() {
    const router = useRouter()
    const { setQuoteResult, torrentFile, selectedFilePaths, selectedStorageProfileId } = useTorrentStore()

    return useMutation({
        mutationFn: async (voucherCode?: string): Promise<QuoteResponse> => {
            if (!torrentFile) {
                throw new Error('No torrent file available')
            }
            if (selectedFilePaths.length === 0) {
                throw new Error('Please select at least one file')
            }
            if (!selectedStorageProfileId) {
                throw new Error('Please select a storage profile')
            }
            return getTorrentQuote(torrentFile, selectedFilePaths, selectedStorageProfileId, voucherCode)
        },
        onSuccess: (data) => {
            // Store quote result for invoice page
            setQuoteResult(data)
            toast.success('Quote received! Redirecting to invoice...')
            // Redirect to the invoice page
            router.push(`/invoices/${data.invoiceId}`)
        },
        onError: (error) => {
            const message = handleTorrentError(error)
            toast.error(message)
        },
    })
}

