// Invoices API client with Zod validation
import apiClient from '../axios'
import {
    invoiceSchema,
    paginatedInvoicesSchema,
    invoiceStatisticsSchema,
} from '@/types/invoices'
import type {
    Invoice,
    PaginatedInvoices,
    InvoicesQueryParams,
    InvoiceStatistics,
} from '@/types/invoices'

// Re-export types for convenience
export type { Invoice, PaginatedInvoices, InvoicesQueryParams, InvoiceStatistics }
export { getInvoicesErrorMessage, invoicesErrorMessages } from '@/types/invoices'

/**
 * Get all invoices for the current user with pagination and optional date filters
 */
export async function getInvoices(params: InvoicesQueryParams = {}): Promise<PaginatedInvoices> {
    const searchParams = new URLSearchParams()

    if (params.pageNumber) {
        searchParams.set('pageNumber', params.pageNumber.toString())
    }
    if (params.pageSize) {
        searchParams.set('pageSize', params.pageSize.toString())
    }
    if (params.dateFrom) {
        searchParams.set('dateFrom', params.dateFrom)
    }
    if (params.dateTo) {
        searchParams.set('dateTo', params.dateTo)
    }

    const url = `/invoices${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await apiClient.get<PaginatedInvoices>(url)
    return paginatedInvoicesSchema.parse(response.data)
}

/**
 * Get a specific invoice by ID
 */
export async function getInvoice(invoiceId: number): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`/invoices/${invoiceId}`)
    return invoiceSchema.parse(response.data)
}

/**
 * Get invoice statistics (total, paid, unpaid counts)
 */
export async function getInvoiceStatistics(): Promise<InvoiceStatistics> {
    const response = await apiClient.get<InvoiceStatistics>('/invoices/statistics')
    return invoiceStatisticsSchema.parse(response.data)
}
