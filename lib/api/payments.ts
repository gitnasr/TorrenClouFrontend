// Payments API client with Zod validation
import apiClient from '../axios'
import axios from 'axios'
import {
    invoicePaymentResultSchema,
    type InvoicePaymentResult,
} from '@/types/torrents'
import {
    cryptoDepositResponseSchema,
    depositDtoSchema,
    paginatedDepositsSchema,
    stablecoinMinimumAmountsResponseSchema,
    type CryptoDepositRequestDto,
    type CryptoDepositResponse,
    type DepositDto,
    type PaginatedDeposits,
    type PaginationParams,
    type StablecoinMinimumAmountsResponse,
} from '@/types/wallet'

// Re-export types for convenience
export type {
    InvoicePaymentResult,
    CryptoDepositRequestDto,
    CryptoDepositResponse,
    DepositDto,
    PaginatedDeposits,
    StablecoinMinimumAmountsResponse,
}

/**
 * Pay an invoice using wallet balance
 * POST /api/invoices/pay?invoiceId={id} (authenticated)
 * 
 * @param invoiceId - The invoice to pay
 * @returns Payment result with job ID
 */
export async function payInvoice(invoiceId: number): Promise<InvoicePaymentResult> {
    const response = await apiClient.post<InvoicePaymentResult>(
        `/invoices/pay?invoiceId=${invoiceId}`
    )
    return invoicePaymentResultSchema.parse(response.data)
}

/**
 * Initiate a crypto deposit
 * POST /api/payments/deposit/crypto (authenticated)
 * 
 * @param request - Deposit request with amount and currency
 * @returns Response with payment URL to redirect user to
 */
export async function initiateCryptoDeposit(
    request: CryptoDepositRequestDto
): Promise<CryptoDepositResponse> {
    const response = await apiClient.post<CryptoDepositResponse>(
        '/payments/deposit/crypto',
        request
    )
    return cryptoDepositResponseSchema.parse(response.data)
}

/**
 * Get user's deposits (paginated)
 * GET /api/payments/deposits (authenticated)
 * 
 * @param params - Pagination parameters
 * @returns Paginated list of deposits
 */
export async function getDeposits(
    params: PaginationParams = {}
): Promise<PaginatedDeposits> {
    const { pageNumber = 1, pageSize = 10 } = params
    const response = await apiClient.get<PaginatedDeposits>(
        '/payments/deposits',
        { params: { pageNumber, pageSize } }
    )
    return paginatedDepositsSchema.parse(response.data)
}

/**
 * Get a single deposit by ID
 * GET /api/payments/deposits/{id} (authenticated)
 * 
 * @param id - Deposit ID
 * @returns Deposit details
 */
export async function getDeposit(id: number): Promise<DepositDto> {
    const response = await apiClient.get<DepositDto>(
        `/payments/deposits/${id}`
    )
    return depositDtoSchema.parse(response.data)
}

/**
 * Get stablecoin minimum deposit amounts
 * GET /api/payments/stablecoins/minimum-amounts (public - no auth required)
 * 
 * @returns List of stablecoins with their minimum amounts
 */
export async function getStablecoinMinimumAmounts(): Promise<StablecoinMinimumAmountsResponse> {
    // This is a public endpoint, so we use a direct axios call without auth
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await axios.get<StablecoinMinimumAmountsResponse>(
        `${baseURL}/payments/stablecoins/minimum-amounts`
    )
    return stablecoinMinimumAmountsResponseSchema.parse(response.data)
}
