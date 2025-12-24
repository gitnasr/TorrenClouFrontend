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
// Transaction Filter Schema
// ============================================

export const transactionFilterDtoSchema = z.object({
    type: transactionTypeSchema,
    count: z.number(),
})

export type TransactionFilterDto = z.infer<typeof transactionFilterDtoSchema>

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
    transactionType?: TransactionTypeDto
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

// ============================================
// Deposit Status Enum
// ============================================

export const depositStatusSchema = z.enum([
    'Pending',
    'Completed',
    'Failed',
    'Expired',
])

export type DepositStatusDto = z.infer<typeof depositStatusSchema>

// ============================================
// Crypto Deposit Request Schema
// ============================================

export const cryptoDepositRequestSchema = z.object({
    amount: z.number().min(1, 'Minimum amount is $1').max(10000, 'Maximum amount is $10,000'),
    currency: z.enum(['USDT', 'USDC', 'DAI', 'LTC']),
})

export type CryptoDepositRequestDto = z.infer<typeof cryptoDepositRequestSchema>

// ============================================
// Crypto Deposit Response Schema
// ============================================

export const cryptoDepositResponseSchema = z.object({
    url: z.string().url(),
})

export type CryptoDepositResponse = z.infer<typeof cryptoDepositResponseSchema>

// ============================================
// Deposit DTO Schema
// ============================================

export const depositDtoSchema = z.object({
    id: z.number(),
    amount: z.number(),
    currency: z.string(),
    paymentProvider: z.string(),
    paymentUrl: z.string().nullable().optional(),
    status: depositStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string().nullable().optional(),
})

export type DepositDto = z.infer<typeof depositDtoSchema>

// ============================================
// Paginated Deposits Schema
// ============================================

export const paginatedDepositsSchema = createPaginatedSchema(depositDtoSchema)

export type PaginatedDeposits = z.infer<typeof paginatedDepositsSchema>

// ============================================
// Stablecoin Minimum Amount Schema
// ============================================

export const stablecoinMinAmountDtoSchema = z.object({
    currency: z.string(),
    minAmount: z.number(),
    fiatEquivalent: z.string(),
})

export type StablecoinMinAmountDto = z.infer<typeof stablecoinMinAmountDtoSchema>

// ============================================
// Stablecoin Minimum Amounts Response Schema
// ============================================

export const stablecoinMinimumAmountsResponseSchema = z.object({
    stablecoins: z.array(stablecoinMinAmountDtoSchema),
})

export type StablecoinMinimumAmountsResponse = z.infer<typeof stablecoinMinimumAmountsResponseSchema>

// ============================================
// Payment Error Codes and Messages
// ============================================

export const paymentErrorMessages: Record<string, string> = {
    // Deposit errors
    INVALID_AMOUNT: 'Amount must be between $1 and $10,000',
    INVALID_CURRENCY: 'Invalid cryptocurrency selected',
    DEPOSIT_NOT_FOUND: 'Deposit not found',
    DEPOSIT_EXPIRED: 'This deposit has expired. Please create a new one.',
    DEPOSIT_FAILED: 'Deposit failed. Please try again.',
    
    // General errors
    UNAUTHORIZED: 'Please log in to continue',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Please check your input and try again',
}

export function getPaymentErrorMessage(code: string): string {
    return paymentErrorMessages[code] || walletErrorMessages[code] || 'An unexpected error occurred. Please try again.'
}