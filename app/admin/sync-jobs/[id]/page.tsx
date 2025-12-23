'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Cloud,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    AlertCircle,
    HardDrive,
    FileText,
    Calendar,
    ExternalLink,
} from 'lucide-react'
import { formatFileSize, formatDateTime, formatRelativeTime } from '@/lib/utils/formatters'
import { useSyncJob } from '@/hooks/useSyncJobs'
import { SyncStatus } from '@/types/enums'
import { syncStatusLabels } from '@/types/sync-jobs'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Status config for badges and icons
const statusConfig: Record<SyncStatus, {
    icon: React.ReactNode
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'warning' | 'processing' | 'pending' | 'success'
    color: string
    bgColor: string
}> = {
    [SyncStatus.NOT_STARTED]: {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'pending',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
    },
    [SyncStatus.SYNCING]: {
        icon: <Cloud className="h-6 w-6" />,
        badgeVariant: 'processing',
        color: 'text-info',
        bgColor: 'bg-info/20',
    },
    [SyncStatus.SYNC_RETRY]: {
        icon: <RefreshCw className="h-6 w-6" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [SyncStatus.COMPLETED]: {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'success',
        color: 'text-success',
        bgColor: 'bg-success/20',
    },
    [SyncStatus.FAILED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
}

// Detail row component
function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium truncate">{value}</p>
            </div>
        </div>
    )
}

// Timeline item component
function TimelineItem({
    step,
    label,
    date,
    isCompleted = false,
    isFailed = false,
}: {
    step: number | string
    label: string
    date: string
    isCompleted?: boolean
    isFailed?: boolean
}) {
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

export default function SyncJobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const syncJobId = Number(params.id)

    const { data: job, isLoading, error, refetch } = useSyncJob(syncJobId)

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Error state
    if (error || !job) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/sync-jobs">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sync Jobs
                        </Link>
                    </Button>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <p className="text-danger mb-4">
                            {error instanceof Error ? error.message : 'Sync job not found'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => refetch()} variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin/sync-jobs">Back to List</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const config = statusConfig[job.status]
    const isActive = job.status === SyncStatus.SYNCING || job.status === SyncStatus.SYNC_RETRY

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/sync-jobs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sync Jobs
                    </Link>
                </Button>
            </div>

            {/* Job Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">
                        {job.requestFileName || `Sync Job #${job.id}`}
                    </h1>
                    <p className="text-muted-foreground">Sync Job #{job.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant={config.badgeVariant} className="text-sm">
                        {syncStatusLabels[job.status]}
                    </Badge>
                    <Button onClick={() => refetch()} variant="ghost" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Progress Card (for active jobs) */}
                    {isActive && (
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
                    )}

                    {/* Error Card (for failed jobs) */}
                    {job.status === SyncStatus.FAILED && job.errorMessage && (
                        <Card className="border-danger/50 bg-danger/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-danger">
                                    <AlertCircle className="h-5 w-5" />
                                    Sync Failed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{job.errorMessage}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Success Card (for completed jobs) */}
                    {job.status === SyncStatus.COMPLETED && (
                        <Card className="border-success/50 bg-success/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-success">
                                    <CheckCircle className="h-5 w-5" />
                                    Sync Completed
                                </CardTitle>
                                <CardDescription>
                                    Files have been successfully synced to {job.destinationType}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}

                    {/* Job Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sync Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Sync Job ID</p>
                                    <p className="font-medium">#{job.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Related Job ID</p>
                                    <Link
                                        href={`/jobs/${job.jobId}`}
                                        target="_blank"
                                        className="font-medium text-primary hover:underline flex items-center gap-1"
                                    >
                                        #{job.jobId}
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Source</p>
                                    <p className="font-medium">{job.sourceType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Destination</p>
                                    <p className="font-medium">{job.destinationType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Size</p>
                                    <p className="font-medium">{formatFileSize(job.totalBytes)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Transferred</p>
                                    <p className="font-medium">{formatFileSize(job.bytesTransferred)}</p>
                                </div>
                                {job.storageProfileName && (
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-muted-foreground">Storage Profile</p>
                                        <p className="font-medium">{job.storageProfileName}</p>
                                    </div>
                                )}
                                {job.retryCount > 0 && (
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-muted-foreground">Retry Count</p>
                                        <p className="font-medium">{job.retryCount}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
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

                    {/* Timeline */}
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
                </div>
            </div>
        </div>
    )
}
