'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDateTime, formatRelativeTime } from '@/lib/utils/formatters'
import type { Job } from '@/types/jobs'

interface JobAdminInfoProps {
    job: Job
}

export function JobAdminInfo({ job }: JobAdminInfoProps) {
    return (
        <Card className="border-warning/50">
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Admin Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {job.lastHeartbeat && (
                    <div>
                        <p className="text-sm text-muted-foreground">Last Heartbeat</p>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="text-sm font-medium cursor-help">
                                        {formatRelativeTime(job.lastHeartbeat)}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{formatDateTime(job.lastHeartbeat)}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
                <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="text-sm font-medium">{job.type}</p>
                </div>
                {job.currentState && (
                    <div>
                        <p className="text-sm text-muted-foreground">Internal State</p>
                        <p className="text-sm font-medium">{job.currentState}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

