'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatFileSize } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { SyncJob } from '@/types/sync-jobs'
import { getSyncJobStatusConfig } from './SyncJobStatusConfig'

interface SyncJobProgressCardProps {
    job: SyncJob
}

export function SyncJobProgressCard({ job }: SyncJobProgressCardProps) {
    const config = getSyncJobStatusConfig(job.status)

    return (
        <Card className="border-info/20 bg-info/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className={cn('animate-pulse', config.color)}>{config.icon}</div>
                    Syncing to {job.destinationType}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{job.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-3" />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transferred</span>
                    <span className="font-medium">
                        {formatFileSize(job.bytesTransferred)} / {formatFileSize(job.totalBytes)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

