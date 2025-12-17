'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getWalletBalance, payInvoice } from '@/lib/api/payments'
import { useTorrentStore } from '@/stores/torrentStore'
import { getTorrentErrorMessage } from '@/types/torrents'
import type { WalletBalanceDto, InvoicePaymentResult } from '@/types/torrents'
import { AxiosError } from 'axios'
import { jobsKeys } from './useJobs'

// ============================================
// Query Keys
// ============================================

export const paymentKeys = {
    all: ['payments'] as const,
    wallet: () => [...paymentKeys.all, 'wallet'] as const,
    balance: () => [...paymentKeys.wallet(), 'balance'] as const,
}

// ============================================
// Error Handler
// ============================================

interface ApiError {
    code?: string
    message?: string
}

function handlePaymentError(error: unknown): string {
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
// Query Hooks
// ============================================

/**
 * Hook to fetch the current user's wallet balance
 */
export function useWalletBalance() {
    const { status } = useSession()

    return useQuery({
        queryKey: paymentKeys.balance(),
        queryFn: getWalletBalance,
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds
    })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for paying invoices
 * Handles payment → job creation → navigation flow
 */
export function useInvoicePayment() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { clearTorrentData } = useTorrentStore()

    return useMutation({
        mutationFn: async (invoiceId: number): Promise<InvoicePaymentResult> => {
            return payInvoice(invoiceId)
        },
        onSuccess: (data) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: jobsKeys.all })
            queryClient.invalidateQueries({ queryKey: paymentKeys.balance() })
            queryClient.invalidateQueries({ queryKey: ['invoices'] })

            // Clear torrent workflow data
            clearTorrentData()

            // Show success message
            if (data.hasStorageProfileWarning && data.storageProfileWarningMessage) {
                toast.warning(data.storageProfileWarningMessage)
            } else {
                toast.success('Payment successful! Your download job has been created.')
            }

            // Navigate to jobs page
            router.push('/torrents/jobs')
        },
        onError: (error) => {
            const message = handlePaymentError(error)
            toast.error(message)
        },
    })
}
