'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    payInvoice,
    initiateCryptoDeposit,
    getDeposits,
    getDeposit,
    getStablecoinMinimumAmounts,
} from '@/lib/api/payments'
import { useTorrentStore } from '@/stores/torrentStore'
import { getTorrentErrorMessage } from '@/types/torrents'
import { getPaymentErrorMessage, type PaginationParams } from '@/types/wallet'
import type { InvoicePaymentResult } from '@/types/torrents'
import type { CryptoDepositRequestDto, CryptoDepositResponse } from '@/types/wallet'
import { AxiosError } from 'axios'
import { jobsKeys } from './useJobs'
import { walletKeys } from './useWallet'

// ============================================
// Query Keys
// ============================================

export const paymentKeys = {
    all: ['payments'] as const,
    deposits: () => [...paymentKeys.all, 'deposits'] as const,
    depositsList: (params: PaginationParams) => [...paymentKeys.deposits(), 'list', params] as const,
    deposit: (id: number) => [...paymentKeys.deposits(), 'detail', id] as const,
    stablecoins: () => [...paymentKeys.all, 'stablecoins'] as const,
    stablecoinMinimums: () => [...paymentKeys.stablecoins(), 'minimums'] as const,
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
            return getPaymentErrorMessage(data.code)
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
// Invoice Payment Hook
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
            queryClient.invalidateQueries({ queryKey: walletKeys.balance() })
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
            router.push('/jobs')
        },
        onError: (error) => {
            const message = handlePaymentError(error)
            toast.error(message)
        },
    })
}

// ============================================
// Deposit Hooks
// ============================================

/**
 * Hook for initiating a crypto deposit
 * Returns mutation that opens payment URL in new tab on success
 */
export function useCryptoDeposit() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: CryptoDepositRequestDto): Promise<CryptoDepositResponse> => {
            return initiateCryptoDeposit(request)
        },
        onSuccess: (data) => {
            // Invalidate deposits list to show new deposit
            queryClient.invalidateQueries({ queryKey: paymentKeys.deposits() })

            // Show success message
            toast.success('Deposit created! Redirecting to payment page...')

            // Open payment URL in new tab
            window.open(data.url, '_blank')
        },
        onError: (error) => {
            const message = handlePaymentError(error)
            toast.error(message)
        },
    })
}

/**
 * Hook to fetch user's deposits (paginated)
 * 
 * @param params - Pagination parameters (pageNumber, pageSize)
 */
export function useDeposits(params: PaginationParams = {}) {
    const { status } = useSession()

    return useQuery({
        queryKey: paymentKeys.depositsList(params),
        queryFn: () => getDeposits(params),
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to fetch a single deposit by ID
 * 
 * @param id - Deposit ID
 */
export function useDeposit(id: number) {
    const { status } = useSession()

    return useQuery({
        queryKey: paymentKeys.deposit(id),
        queryFn: () => getDeposit(id),
        enabled: status === 'authenticated' && id > 0,
        staleTime: 10 * 1000, // 10 seconds - shorter for status updates
    })
}

/**
 * Hook to fetch stablecoin minimum deposit amounts
 * This is a public endpoint, so no auth is required
 */
export function useStablecoinMinimumAmounts() {
    return useQuery({
        queryKey: paymentKeys.stablecoinMinimums(),
        queryFn: getStablecoinMinimumAmounts,
        staleTime: 5 * 60 * 1000, // 5 minutes - these don't change often
    })
}

// Export error handler for use in components
export { handlePaymentError }
