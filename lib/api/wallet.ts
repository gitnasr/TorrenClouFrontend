// Wallet API client with Zod validation
import apiClient from '../axios'
import {
    walletBalanceDtoSchema,
    walletTransactionDtoSchema,
    paginatedWalletTransactionsSchema,
    type WalletBalanceDto,
    type WalletTransactionDto,
    type PaginatedWalletTransactions,
    type PaginationParams,
} from '@/types/wallet'

// Re-export types for convenience
export type { WalletBalanceDto, WalletTransactionDto, PaginatedWalletTransactions }

/**
 * Get the current user's wallet balance
 * GET /api/finance/wallet/balance (authenticated)
 */
export async function getWalletBalance(): Promise<WalletBalanceDto> {
    const response = await apiClient.get<WalletBalanceDto>('/finance/wallet/balance')
    return walletBalanceDtoSchema.parse(response.data)
}

/**
 * Get the current user's wallet transactions (paginated)
 * GET /api/finance/wallet/transactions (authenticated)
 * 
 * @param params - Pagination parameters
 * @returns Paginated list of transactions
 */
export async function getWalletTransactions(
    params: PaginationParams = {}
): Promise<PaginatedWalletTransactions> {
    const { pageNumber = 1, pageSize = 10 } = params
    const response = await apiClient.get<PaginatedWalletTransactions>(
        '/finance/wallet/transactions',
        { params: { pageNumber, pageSize } }
    )
    return paginatedWalletTransactionsSchema.parse(response.data)
}

/**
 * Get a single wallet transaction by ID
 * GET /api/finance/wallet/transactions/{id} (authenticated)
 * 
 * @param id - Transaction ID
 * @returns Transaction details
 */
export async function getWalletTransaction(id: number): Promise<WalletTransactionDto> {
    const response = await apiClient.get<WalletTransactionDto>(
        `/finance/wallet/transactions/${id}`
    )
    return walletTransactionDtoSchema.parse(response.data)
}
