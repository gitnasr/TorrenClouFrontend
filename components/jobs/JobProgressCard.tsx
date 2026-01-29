'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatFileSize } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { Job } from '@/types/jobs'
import { getJobStatusConfig } from './JobStatusConfig'
import { JobStatus } from '@/types/enums'

interface JobProgressCardProps {
    job: Job
}

export function JobProgressCard({ job }: JobProgressCardProps) {
    const config = getJobStatusConfig(job.status as JobStatus)

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className={cn('animate-pulse', config.color)}>{config.icon}</div>
                    {job.currentState || config.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{job.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={job.progressPercentage} className="h-3" />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Downloaded</span>
                    <span className="font-medium">
                        {formatFileSize(job.bytesDownloaded)} / {formatFileSize(job.totalBytes)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}



