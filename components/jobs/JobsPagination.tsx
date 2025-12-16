'use client'

import { useJobs } from '@/hooks/useJobs'
import { useJobsStore } from '@/stores/jobsStore'
import { Pagination } from '@/components/ui/pagination'
import type { JobsPaginationProps } from '@/types/jobs'
import { cn } from '@/lib/utils'

export function JobsPagination({ className }: JobsPaginationProps) {
    const { data } = useJobs()
    const { currentPage, pageSize, setCurrentPage, setPageSize } = useJobsStore()

    if (!data || data.totalCount === 0) return null

    return (
        <div className={cn('mt-6', className)}>
            <Pagination
                totalItems={data.totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 25, 50]}
            />
        </div>
    )
}
