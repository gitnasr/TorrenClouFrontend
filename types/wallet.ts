// Wallet API types with Zod validation schemas
import { z } from 'zod'
import type { WalletTransaction } from '@/types/api'

// ============================================
// Component Props Types
// ============================================

export interface TransactionListProps {
    transactions: WalletTransaction[]
    limit?: number
    showViewAll?: boolean
    className?: string
}

export interface BalanceCardProps {
    balance: number
    changeAmount?: number
    changePercentage?: number
    showActions?: boolean
    className?: string
}

// ============================================
// Transaction Type Enum
// ============================================

export const transactionTypeSchema = z.enum([
    'DEPOSIT',
    'PAYMENT',
    'REFUND',
    'ADMIN_ADJUSTMENT',
    'BONUS',
    'DEDUCTION',
])

export type TransactionTypeDto = z.infer<typeof transactionTypeSchema>

// ============================================
// Wallet Balance Schema
// ============================================

export const walletBalanceDtoSchema = z.object({
    balance: z.number(),
    currency: z.string(),
})

export type WalletBalanceDto = z.infer<typeof walletBalanceDtoSchema>

// ============================================
// Wallet Transaction Schema
// ============================================

export const walletTransactionDtoSchema = z.object({
    id: z.number(),
    amount: z.number(),
    type: transactionTypeSchema,
    referenceId: z.string().nullable().optional(),
    description: z.string(),
    createdAt: z.string(),
})

export type WalletTransactionDto = z.infer<typeof walletTransactionDtoSchema>

// ============================================
// Admin Wallet Schema
// ============================================

export const adminWalletDtoSchema = z.object({
    userId: z.number(),
    userEmail: z.string(),
    userFullName: z.string(),
    balance: z.number(),
    transactionCount: z.number(),
    lastTransactionDate: z.string().nullable().optional(),
})

export type AdminWalletDto = z.infer<typeof adminWalletDtoSchema>

// ============================================
// Admin Adjust Balance Request Schema
// ============================================

export const adminAdjustBalanceRequestSchema = z.object({
    amount: z.number().refine(val => val !== 0, {
        message: 'Amount cannot be zero',
    }),
    description: z.string().min(1, 'Description is required'),
})

export type AdminAdjustBalanceRequest = z.infer<typeof adminAdjustBalanceRequestSchema>

// ============================================
// Paginated Result Schema Factory
// ============================================

export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        items: z.array(itemSchema),
        totalCount: z.number(),
        pageNumber: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
        hasPreviousPage: z.boolean(),
        hasNextPage: z.boolean(),
    })
}

// Pre-built paginated schemas
export const paginatedWalletTransactionsSchema = createPaginatedSchema(walletTransactionDtoSchema)
export const paginatedAdminWalletsSchema = createPaginatedSchema(adminWalletDtoSchema)
export const paginatedAdminTransactionsSchema = createPaginatedSchema(walletTransactionDtoSchema)

export type PaginatedWalletTransactions = z.infer<typeof paginatedWalletTransactionsSchema>
export type PaginatedAdminWallets = z.infer<typeof paginatedAdminWalletsSchema>
export type PaginatedAdminTransactions = z.infer<typeof paginatedAdminTransactionsSchema>

// ============================================
// Pagination Parameters
// ============================================

export interface PaginationParams {
    pageNumber?: number
    pageSize?: number
}

// ============================================
// Error Codes and Messages
// ============================================

export const walletErrorMessages: Record<string, string> = {
    // User errors
    USER_ERROR: 'User not found',
    NOT_FOUND: 'Transaction not found',
    DATABASE_ERROR: 'A database error occurred. Please try again.',

    // Balance operations
    INSUFFICIENT_FUNDS: 'Insufficient funds. Please add more balance.',
    WALLET_BUSY: 'Wallet is currently processing another transaction. Please try again.',
    DEDUCTION_ERROR: 'Invalid deduction amount',
    DEPOSIT_ERROR: 'Invalid deposit amount',

    // Admin operations
    INVALID_AMOUNT: 'Amount cannot be zero',
    MISSING_DESCRIPTION: 'Description is required for balance adjustment',
}

export function getWalletErrorMessage(code: string): string {
    return walletErrorMessages[code] || 'An unexpected error occurred. Please try again.'
}
