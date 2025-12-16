'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getInvoices, getInvoice, getInvoiceStatistics } from '@/lib/api/invoices'
import { useInvoicesStore } from '@/stores/invoicesStore'
import type { InvoicesQueryParams, PaginatedInvoices, Invoice, InvoiceStatistics } from '@/types/invoices'
import { paginatedInvoicesSchema, invoiceSchema, invoiceStatisticsSchema } from '@/types/invoices'

// ============================================
// Query Keys
// ============================================

export const invoicesKeys = {
    all: ['invoices'] as const,
    lists: () => [...invoicesKeys.all, 'list'] as const,
    list: (params: InvoicesQueryParams) => [...invoicesKeys.lists(), params] as const,
    details: () => [...invoicesKeys.all, 'detail'] as const,
    detail: (id: number) => [...invoicesKeys.details(), id] as const,
    statistics: () => [...invoicesKeys.all, 'statistics'] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch paginated invoices list with filters
 */
export function useInvoices() {
    const { status } = useSession()
    const { currentPage, pageSize, dateFrom, dateTo } = useInvoicesStore()

    return useQuery({
        queryKey: invoicesKeys.list({ pageNumber: currentPage, pageSize, dateFrom, dateTo }),
        queryFn: async () => {
            const data = await getInvoices({
                pageNumber: currentPage,
                pageSize,
                dateFrom,
                dateTo,
            })
            // Validate with Zod
            return paginatedInvoicesSchema.parse(data)
        },
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds - invoices don't change frequently
    })
}

/**
 * Hook to fetch a specific invoice by ID
 */
export function useInvoice(invoiceId: number | null) {
    const { status } = useSession()

    return useQuery({
        queryKey: invoicesKeys.detail(invoiceId ?? 0),
        queryFn: async () => {
            if (!invoiceId) {
                throw new Error('Invalid invoice ID')
            }
            const data = await getInvoice(invoiceId)
            // Validate with Zod
            return invoiceSchema.parse(data)
        },
        enabled: status === 'authenticated' && !!invoiceId,
        staleTime: 60 * 1000, // 1 minute - invoice details are static
    })
}

/**
 * Hook to fetch invoice statistics
 */
export function useInvoiceStatistics() {
    const { status } = useSession()

    return useQuery({
        queryKey: invoicesKeys.statistics(),
        queryFn: async () => {
            const data = await getInvoiceStatistics()
            // Validate with Zod
            return invoiceStatisticsSchema.parse(data)
        },
        enabled: status === 'authenticated',
        staleTime: 60 * 1000, // 1 minute - statistics update slowly
    })
}
