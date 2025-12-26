'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import { syncStatusLabels } from '@/types/sync-jobs'
import type { SyncJob } from '@/types/sync-jobs'
import { getSyncJobStatusConfig } from './SyncJobStatusConfig'

interface SyncJobStatusCardProps {
    job: SyncJob
}

export function SyncJobStatusCard({ job }: SyncJobStatusCardProps) {
    const config = getSyncJobStatusConfig(job.status)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className={cn(config.bgColor, config.color, 'p-2 rounded-lg')}>
                        {config.icon}
                    </div>
                    Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-medium">{syncStatusLabels[job.status]}</p>
                {job.nextRetryAt && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Next retry: {formatRelativeTime(job.nextRetryAt)}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

