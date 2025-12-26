// Zustand store for Jobs UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { JobStatus } from '@/types/enums'

interface JobsUIState {
    // Filter state
    selectedStatus: JobStatus | null
    setSelectedStatus: (status: JobStatus | null) => void
    resetFilters: () => void

    // Pagination state
    currentPage: number
    pageSize: number
    setCurrentPage: (page: number) => void
    setPageSize: (size: number) => void

    // Selected job for detail view
    selectedJobId: number | null
    setSelectedJobId: (id: number | null) => void

    // Modal states
    showCancelModal: boolean
    showRefundModal: boolean
    setShowCancelModal: (show: boolean) => void
    setShowRefundModal: (show: boolean) => void
    openCancelModal: () => void
    openRefundModal: () => void
    closeModals: () => void

    // Reset all state
    reset: () => void
}

export const useJobsStore = create<JobsUIState>()(
    devtools(
        (set) => ({
            // Filter state
            selectedStatus: null,
            setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 1 }), // Reset to page 1 when filter changes
            resetFilters: () => set({ selectedStatus: null, currentPage: 1 }),

            // Pagination state
            currentPage: 1,
            pageSize: 10,
            setCurrentPage: (page) => set({ currentPage: page }),
            setPageSize: (size) => set({ pageSize: size, currentPage: 1 }), // Reset to page 1 when page size changes

            // Selected job
            selectedJobId: null,
            setSelectedJobId: (id) => set({ selectedJobId: id }),

            // Modal states
            showCancelModal: false,
            showRefundModal: false,
            setShowCancelModal: (show) => set({ showCancelModal: show }),
            setShowRefundModal: (show) => set({ showRefundModal: show }),
            openCancelModal: () => set({ showCancelModal: true }),
            openRefundModal: () => set({ showRefundModal: true }),
            closeModals: () => set({ showCancelModal: false, showRefundModal: false }),

            // Reset all
            reset: () => set({
                selectedStatus: null,
                currentPage: 1,
                pageSize: 10,
                selectedJobId: null,
                showCancelModal: false,
                showRefundModal: false,
            }),
        }),
        { name: 'JobsStore' }
    )
)

// Selectors for optimized re-renders
export const selectSelectedStatus = (state: JobsUIState) => state.selectedStatus
export const selectCurrentPage = (state: JobsUIState) => state.currentPage
export const selectPageSize = (state: JobsUIState) => state.pageSize
export const selectSelectedJobId = (state: JobsUIState) => state.selectedJobId
export const selectShowCancelModal = (state: JobsUIState) => state.showCancelModal
export const selectShowRefundModal = (state: JobsUIState) => state.showRefundModal
