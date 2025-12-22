// Admin Wallet API client with Zod validation
import apiClient from '../axios'
import {
    paginatedAdminWalletsSchema,
    paginatedAdminTransactionsSchema,
    walletTransactionDtoSchema,
    adminAdjustBalanceRequestSchema,
    type PaginatedAdminWallets,
    type PaginatedAdminTransactions,
    type AdminAdjustBalanceRequest,
    type WalletTransactionDto,
    type PaginationParams,
} from '@/types/wallet'

// Re-export types for convenience
export type {
    PaginatedAdminWallets,
    PaginatedAdminTransactions,
    AdminAdjustBalanceRequest,
}

/**
 * Get all wallets (admin only, paginated)
 * GET /api/admin/payments/wallets (admin authenticated)
 * 
 * @param params - Pagination parameters
 * @returns Paginated list of wallets
 */
export async function getAdminWallets(
    params: PaginationParams = {}
): Promise<PaginatedAdminWallets> {
    const { pageNumber = 1, pageSize = 10 } = params
    const response = await apiClient.get<PaginatedAdminWallets>(
        '/admin/payments/wallets',
        { params: { pageNumber, pageSize } }
    )
    return paginatedAdminWalletsSchema.parse(response.data)
}

/**
 * Get all transactions (admin only, paginated)
 * GET /api/admin/payments/transactions (admin authenticated)
 * 
 * @param params - Pagination parameters
 * @returns Paginated list of transactions
 */
export async function getAdminTransactions(
    params: PaginationParams = {}
): Promise<PaginatedAdminTransactions> {
    const { pageNumber = 1, pageSize = 10 } = params
    const response = await apiClient.get<PaginatedAdminTransactions>(
        '/admin/payments/transactions',
        { params: { pageNumber, pageSize } }
    )
    return paginatedAdminTransactionsSchema.parse(response.data)
}

/**
 * Adjust a user's wallet balance (admin only)
 * POST /api/admin/payments/wallets/{userId}/adjust (admin authenticated)
 * 
 * @param userId - User ID to adjust balance for
 * @param request - Adjustment request with amount and description
 * @returns The created transaction
 */
export async function adjustUserBalance(
    userId: number,
    request: AdminAdjustBalanceRequest
): Promise<WalletTransactionDto> {
    // Validate request before sending
    const validatedRequest = adminAdjustBalanceRequestSchema.parse(request)

    const response = await apiClient.post<WalletTransactionDto>(
        `/admin/payments/wallets/${userId}/adjust`,
        validatedRequest
    )
    return walletTransactionDtoSchema.parse(response.data)
}
