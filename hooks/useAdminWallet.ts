'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
    getAdminWallets,
    getAdminTransactions,
    adjustUserBalance,
} from '@/lib/api/admin-wallet'
import { getWalletErrorMessage, type AdminAdjustBalanceRequest, type PaginationParams } from '@/types/wallet'
import { walletKeys } from './useWallet'
import { AxiosError } from 'axios'

// ============================================
// Query Keys
// ============================================

export const adminWalletKeys = {
    all: ['admin-wallet'] as const,
    wallets: () => [...adminWalletKeys.all, 'wallets'] as const,
    walletsList: (params: PaginationParams) =>
        [...adminWalletKeys.wallets(), params] as const,
    transactions: () => [...adminWalletKeys.all, 'transactions'] as const,
    transactionsList: (params: PaginationParams) =>
        [...adminWalletKeys.transactions(), params] as const,
}

// ============================================
// Error Handler
// ============================================

interface ApiError {
    code?: string
    message?: string
}

function handleAdminWalletError(error: unknown): string {
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
 * Hook to fetch all wallets (admin only, paginated)
 * 
 * @param params - Pagination parameters
 */
export function useAdminWallets(params: PaginationParams = {}) {
    const { status, data: session } = useSession()
    const isAdmin = session?.user?.role === 'Admin'

    return useQuery({
        queryKey: adminWalletKeys.walletsList(params),
        queryFn: () => getAdminWallets(params),
        enabled: status === 'authenticated' && isAdmin,
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to fetch all transactions (admin only, paginated)
 * 
 * @param params - Pagination parameters
 */
export function useAdminTransactions(params: PaginationParams = {}) {
    const { status, data: session } = useSession()
    const isAdmin = session?.user?.role === 'Admin'

    return useQuery({
        queryKey: adminWalletKeys.transactionsList(params),
        queryFn: () => getAdminTransactions(params),
        enabled: status === 'authenticated' && isAdmin,
        staleTime: 30 * 1000, // 30 seconds
    })
}

// ============================================
// Mutation Hooks
// ============================================

interface AdjustBalanceParams {
    userId: number
    request: AdminAdjustBalanceRequest
}

/**
 * Hook for adjusting user balance (admin only)
 * Auto-invalidates wallet queries on success
 */
export function useAdjustBalance() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, request }: AdjustBalanceParams) => {
            return adjustUserBalance(userId, request)
        },
        onSuccess: (data, variables) => {
            // Invalidate admin wallets list
            queryClient.invalidateQueries({ queryKey: adminWalletKeys.wallets() })
            // Invalidate admin transactions
            queryClient.invalidateQueries({ queryKey: adminWalletKeys.transactions() })
            // Invalidate user wallet queries (in case adjusting own wallet)
            queryClient.invalidateQueries({ queryKey: walletKeys.all })

            const action = data.amount >= 0 ? 'credited' : 'debited'
            toast.success(`Successfully ${action} $${Math.abs(data.amount).toFixed(2)} to user #${variables.userId}`)
        },
        onError: (error) => {
            const message = handleAdminWalletError(error)
            toast.error(message)
        },
    })
}
