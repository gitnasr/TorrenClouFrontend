// Wallet API client with Zod validation
import apiClient from '../axios'
import {
    walletBalanceDtoSchema,
    walletTransactionDtoSchema,
    paginatedWalletTransactionsSchema,
    transactionFilterDtoSchema,
    type WalletBalanceDto,
    type WalletTransactionDto,
    type PaginatedWalletTransactions,
    type PaginationParams,
    type TransactionFilterDto,
} from '@/types/wallet'

// Re-export types for convenience
export type { WalletBalanceDto, WalletTransactionDto, PaginatedWalletTransactions, TransactionFilterDto }

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
 * @param params - Pagination parameters and optional transaction type filter
 * @returns Paginated list of transactions
 */
export async function getWalletTransactions(
    params: PaginationParams = {}
): Promise<PaginatedWalletTransactions> {
    const { pageNumber = 1, pageSize = 10, transactionType } = params
    const queryParams: Record<string, string | number> = { pageNumber, pageSize }
    
    if (transactionType) {
        queryParams.transactionType = transactionType
    }
    
    const response = await apiClient.get<PaginatedWalletTransactions>(
        '/finance/wallet/transactions',
        { params: queryParams }
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

/**
 * Get available transaction type filters for the current user
 * GET /api/finance/wallet/transactions/filters (authenticated)
 * 
 * @returns Array of transaction types with counts (only types with count > 0)
 */
export async function getWalletTransactionFilters(): Promise<TransactionFilterDto[]> {
    const response = await apiClient.get<{ success: boolean; data: TransactionFilterDto[] } | TransactionFilterDto[]>(
        '/finance/wallet/transactions/filters'
    )
    // Handle both wrapped response format {success, data} and direct array format
    const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data as { success: boolean; data: TransactionFilterDto[] }).data || []
    return data.map(item => transactionFilterDtoSchema.parse(item))
}
