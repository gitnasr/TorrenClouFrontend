'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import { SyncStatus } from '@/types/enums'
import type { SyncJob } from '@/types/sync-jobs'

interface TimelineItemProps {
    step: number | string
    label: string
    date: string
    isCompleted?: boolean
    isFailed?: boolean
}

function TimelineItem({
    step,
    label,
    date,
    isCompleted = false,
    isFailed = false,
}: TimelineItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                isCompleted && 'bg-success text-success-foreground',
                isFailed && 'bg-danger text-danger-foreground',
                !isCompleted && !isFailed && 'bg-primary text-primary-foreground'
            )}>
                {step}
            </div>
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(date)}</p>
            </div>
        </div>
    )
}

interface SyncJobTimelineCardProps {
    job: SyncJob
}

export function SyncJobTimelineCard({ job }: SyncJobTimelineCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <TimelineItem
                        step={1}
                        label="Created"
                        date={job.createdAt}
                    />
                    {job.startedAt && (
                        <TimelineItem
                            step={2}
                            label="Started Syncing"
                            date={job.startedAt}
                        />
                    )}
                    {job.status === SyncStatus.COMPLETED && job.completedAt && (
                        <TimelineItem
                            step="✓"
                            label="Completed"
                            date={job.completedAt}
                            isCompleted
                        />
                    )}
                    {job.status === SyncStatus.FAILED && job.completedAt && (
                        <TimelineItem
                            step="✗"
                            label="Failed"
                            date={job.completedAt}
                            isFailed
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

