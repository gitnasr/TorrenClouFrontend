// Invoices types and Zod schemas
import { z } from 'zod'
import { pricingSnapshotSchema } from './torrents'

// ============================================
// Zod Schemas
// ============================================

// Voucher DTO Schema
export const voucherDtoSchema = z.object({
    code: z.string(),
    type: z.enum(['Percentage', 'FixedAmount']),
    value: z.number().min(0),
    discountAmount: z.number().min(0),
})

export type VoucherDto = z.infer<typeof voucherDtoSchema>

export const invoiceSchema = z.object({
    id: z.number().int().positive(),
    userId: z.number().int().positive(),
    jobId: z.number().int().positive().nullable(),
    originalAmountInUSD: z.number().min(0),
    finalAmountInUSD: z.number().min(0),
    finalAmountInNCurrency: z.number().min(0),
    exchangeRate: z.number().min(0),
    paidAt: z.string().nullable(),
    cancelledAt: z.string().nullable(),
    refundedAt: z.string().nullable(),
    torrentFileId: z.number().int().positive(),
    torrentFileName: z.string().nullable(),
    expiresAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
    // Pricing snapshot from backend (parsed from PricingSnapshotJson)
    // Keep pricingSnapshot for backward compatibility (optional since API now uses pricingDetails)
    pricingSnapshot: pricingSnapshotSchema.nullable().optional(),
    // New pricing details field (same as pricingSnapshot, but using new naming)
    pricingDetails: pricingSnapshotSchema.nullable().optional(),
    // Voucher information
    voucher: voucherDtoSchema.nullable().optional(),
    voucherDiscountAmount: z.number().min(0).optional(),
    // Pricing calculation breakdown
    basePrice: z.number().min(0).optional(), // Price before health multiplier
    priceAfterHealth: z.number().min(0).optional(), // Price after health multiplier, before voucher
    minimumChargeApplied: z.boolean().optional(), // Whether $0.20 minimum charge was enforced
    // Computed properties from backend
    isPaid: z.boolean(),
    isCancelled: z.boolean(),
    isRefunded: z.boolean(),
    isExpired: z.boolean(),
})

export const paginatedInvoicesSchema = z.object({
    items: z.array(invoiceSchema),
    totalCount: z.number().int().min(0),
    pageNumber: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().min(0),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
})

export const invoiceStatisticsSchema = z.object({
    totalInvoices: z.number().int().min(0),
    paidInvoices: z.number().int().min(0),
    unpaidInvoices: z.number().int().min(0),
})

// ============================================
// TypeScript Types
// ============================================

export type Invoice = z.infer<typeof invoiceSchema>
export type PaginatedInvoices = z.infer<typeof paginatedInvoicesSchema>
export type InvoiceStatistics = z.infer<typeof invoiceStatisticsSchema>

export interface InvoicesQueryParams {
    pageNumber?: number
    pageSize?: number
    dateFrom?: string | null
    dateTo?: string | null
}

// ============================================
// Component Props
// ============================================

export interface InvoiceCardProps {
    invoice: Invoice
    className?: string
}

export interface InvoiceListProps {
    invoices: Invoice[]
    isLoading?: boolean
    error?: Error | null
}

export interface InvoiceDetailProps {
    invoice: Invoice
}

// ============================================
// Error Messages
// ============================================

export const invoicesErrorMessages = {
    NOT_FOUND: 'Invoice not found.',
    UNAUTHORIZED: 'You are not authorized to view this invoice.',
    FETCH_FAILED: 'Failed to fetch invoices. Please try again.',
    STATISTICS_FAILED: 'Failed to fetch invoice statistics.',
} as const

export function getInvoicesErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const code = (error as any).code
        if (code && code in invoicesErrorMessages) {
            return invoicesErrorMessages[code as keyof typeof invoicesErrorMessages]
        }
        return error.message
    }
    return invoicesErrorMessages.FETCH_FAILED
}
