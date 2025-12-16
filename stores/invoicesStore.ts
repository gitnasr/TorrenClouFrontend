// Zustand store for Invoices UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface InvoicesUIState {
    // Pagination state
    currentPage: number
    pageSize: number
    setCurrentPage: (page: number) => void
    setPageSize: (size: number) => void

    // Filter state (date range)
    dateFrom: string | null
    dateTo: string | null
    setDateFrom: (date: string | null) => void
    setDateTo: (date: string | null) => void
    setDateRange: (from: string | null, to: string | null) => void
    resetFilters: () => void

    // Selected invoice for detail view
    selectedInvoiceId: number | null
    setSelectedInvoiceId: (id: number | null) => void

    // Reset all state
    reset: () => void
}

export const useInvoicesStore = create<InvoicesUIState>()(
    devtools(
        (set) => ({
            // Pagination state
            currentPage: 1,
            pageSize: 10,
            setCurrentPage: (page) => set({ currentPage: page }),
            setPageSize: (size) => set({ pageSize: size, currentPage: 1 }), // Reset to page 1 when size changes

            // Filter state
            dateFrom: null,
            dateTo: null,
            setDateFrom: (date) => set({ dateFrom: date, currentPage: 1 }), // Reset to page 1 when filter changes
            setDateTo: (date) => set({ dateTo: date, currentPage: 1 }),
            setDateRange: (from, to) => set({ dateFrom: from, dateTo: to, currentPage: 1 }),
            resetFilters: () => set({ dateFrom: null, dateTo: null, currentPage: 1 }),

            // Selected invoice
            selectedInvoiceId: null,
            setSelectedInvoiceId: (id) => set({ selectedInvoiceId: id }),

            // Reset all
            reset: () => set({
                currentPage: 1,
                pageSize: 10,
                dateFrom: null,
                dateTo: null,
                selectedInvoiceId: null,
            }),
        }),
        { name: 'InvoicesStore' }
    )
)

// Selectors for optimized re-renders
export const selectCurrentPage = (state: InvoicesUIState) => state.currentPage
export const selectPageSize = (state: InvoicesUIState) => state.pageSize
export const selectDateFrom = (state: InvoicesUIState) => state.dateFrom
export const selectDateTo = (state: InvoicesUIState) => state.dateTo
export const selectSelectedInvoiceId = (state: InvoicesUIState) => state.selectedInvoiceId
