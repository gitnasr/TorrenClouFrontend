'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    RefreshCcw,
    StopCircle,
    DollarSign,
    Loader2,
} from 'lucide-react'
import type { Job } from '@/types/jobs'
import { getJobStatusConfig } from './JobStatusConfig'
import { JobStatus } from '@/types/enums'
import { useJobsStore } from '@/stores/jobsStore'

interface JobHeaderProps {
    job: Job
    onRetry?: () => void
    isRetrying?: boolean
    isCancelling?: boolean
    isRefunding?: boolean
}

export function JobHeader({
    job,
    onRetry,
    isRetrying,
    isCancelling,
    isRefunding,
}: JobHeaderProps) {
    const config = getJobStatusConfig(job.status as JobStatus)
    const { openCancelModal, openRefundModal } = useJobsStore()

    return (
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{job.requestFileName || `Job #${job.id}`}</h1>
                <p className="text-muted-foreground">Job #{job.id}</p>
                {job.currentState && (
                    <p className="text-sm text-muted-foreground mt-1">{job.currentState}</p>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                    <Badge variant={config.badgeVariant} className="text-sm">
                        {config.label}
                    </Badge>
                    {job.isRefunded && (
                        <Badge variant="secondary" className="text-sm">
                            Refunded
                        </Badge>
                    )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2">
                    {job.canRetry && onRetry && (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onRetry}
                                        disabled={isRetrying}
                                    >
                                        {isRetrying ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                        )}
                                        Retry
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Retry this job from its current phase</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {job.canCancel && (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={openCancelModal}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <StopCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Cancel
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cancel this job and receive a refund</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {job.canRefund && (
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openRefundModal}
                                        disabled={isRefunding}
                                    >
                                        {isRefunding ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <DollarSign className="mr-2 h-4 w-4" />
                                        )}
                                        Refund
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Request a refund for this failed job</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    )
}

