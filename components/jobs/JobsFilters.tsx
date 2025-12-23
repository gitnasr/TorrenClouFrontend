'use client'

import { useJobsStore } from '@/stores/jobsStore'
import { JobStatus } from '@/types/enums'
import type { JobsFiltersProps } from '@/types/jobs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'
import { useJobStatistics } from '@/hooks/useJobs'
import { statusLabels } from '@/types/jobs'

export function JobsFilters({ className }: JobsFiltersProps) {
    const { selectedStatus, setSelectedStatus, resetFilters } = useJobsStore()
    const { data: jobStats } = useJobStatistics()

    const statusOptions: { value: JobStatus | null | string; label: string }[] = [
        { value: null, label: 'All Statuses' },
        ...(jobStats?.statusFilters ?? []).map((sf) => {
            const statusKey = sf.status as JobStatus
            const baseLabel = statusLabels[statusKey] ?? sf.status
            return {
                value: sf.status,
                label: `${baseLabel} (${sf.count})`,
            }
        }),
    ]

    return (
        <div className={cn(
            'flex items-center gap-4 p-4 bg-surface-100 border border-surface-200 rounded-xl',
            className
        )}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Status:</span>
            </div>

            <select
                value={selectedStatus ?? ''}
                onChange={(e) => setSelectedStatus(e.target.value ? (e.target.value as JobStatus) : null)}
                className="h-9 px-3 rounded-lg border border-surface-300 bg-surface-50 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                           transition-colors"
            >
                {statusOptions.map((option) => (
                    <option key={option.value ?? 'all'} value={option.value ?? ''}>
                        {option.label}
                    </option>
                ))}
            </select>

            {selectedStatus && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    )
}
