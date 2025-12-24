'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
    getWalletBalance,
    getWalletTransactions,
    getWalletTransaction,
    getWalletTransactionFilters,
} from '@/lib/api/wallet'
import { getWalletErrorMessage } from '@/types/wallet'
import type { PaginationParams } from '@/types/wallet'
import { AxiosError } from 'axios'

// ============================================
// Query Keys
// ============================================

export const walletKeys = {
    all: ['wallet'] as const,
    balance: () => [...walletKeys.all, 'balance'] as const,
    transactions: () => [...walletKeys.all, 'transactions'] as const,
    transactionsList: (params: PaginationParams) =>
        [...walletKeys.transactions(), 'list', params] as const,
    transaction: (id: number) =>
        [...walletKeys.transactions(), id] as const,
    transactionFilters: () => [...walletKeys.transactions(), 'filters'] as const,
}

// ============================================
// Error Handler
// ============================================

interface ApiError {
    code?: string
    message?: string
}

function handleWalletError(error: unknown): string {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ApiError
        if (data.code) {
            return getWalletErrorMessage(data.code)
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
 * Stale time: 30 seconds
 */
export function useWalletBalance() {
    const { status } = useSession()

    return useQuery({
        queryKey: walletKeys.balance(),
        queryFn: getWalletBalance,
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to fetch the current user's wallet transactions (paginated)
 * 
 * @param params - Pagination parameters (pageNumber, pageSize)
 */
export function useWalletTransactions(params: PaginationParams = {}) {
    const { status } = useSession()

    return useQuery({
        queryKey: walletKeys.transactionsList(params),
        queryFn: () => getWalletTransactions(params),
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to fetch a single wallet transaction by ID
 * 
 * @param id - Transaction ID
 */
export function useWalletTransaction(id: number) {
    const { status } = useSession()

    return useQuery({
        queryKey: walletKeys.transaction(id),
        queryFn: () => getWalletTransaction(id),
        enabled: status === 'authenticated' && id > 0,
    })
}

/**
 * Hook to fetch available transaction type filters for the current user
 * Stale time: 60 seconds (filters don't change frequently)
 */
export function useWalletTransactionFilters() {
    const { status } = useSession()

    return useQuery({
        queryKey: walletKeys.transactionFilters(),
        queryFn: getWalletTransactionFilters,
        enabled: status === 'authenticated',
        staleTime: 60 * 1000, // 60 seconds
    })
}

// Export error handler for use in components
export { handleWalletError }
