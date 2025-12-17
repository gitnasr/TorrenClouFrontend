// Payments API client with Zod validation
import apiClient from '../axios'
import {
    walletBalanceSchema,
    invoicePaymentResultSchema,
    type WalletBalanceDto,
    type InvoicePaymentResult,
} from '@/types/torrents'

// Re-export types for convenience
export type { WalletBalanceDto, InvoicePaymentResult }

/**
 * Get the current user's wallet balance
 * GET /api/payments/wallet/balance (authenticated)
 */
export async function getWalletBalance(): Promise<WalletBalanceDto> {
    const response = await apiClient.get<WalletBalanceDto>('/payments/wallet/balance')
    return walletBalanceSchema.parse(response.data)
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
