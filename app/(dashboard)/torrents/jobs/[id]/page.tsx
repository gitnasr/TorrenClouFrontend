'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    ArrowLeft,
    Download,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    HardDrive,
    FileText,
    RefreshCcw,
    AlertCircle,
    Loader2,
    Cloud
} from 'lucide-react'
import { formatFileSize, formatDateTime, formatRelativeTime } from '@/lib/utils/formatters'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useJob } from '@/hooks/useJobs'
import { JobStatus, UserRole } from '@/types/enums'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

const statusConfig: Record<JobStatus, {
    icon: React.ReactNode
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'warning' | 'processing' | 'pending'
    label: string
    color: string
}> = {
    [JobStatus.QUEUED]: {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'pending',
        label: 'Queued',
        color: 'text-warning',
    },
    [JobStatus.DOWNLOADING]: {
        icon: <Download className="h-6 w-6" />,
        badgeVariant: 'processing',
        label: 'Downloading',
        color: 'text-teal-primary',
    },
    [JobStatus.SYNCING]: {
        icon: <Cloud className="h-6 w-6" />,
        badgeVariant: 'secondary',
        label: 'Syncing to storage',
        color: 'text-teal-secondary',
    },
    [JobStatus.PENDING_UPLOAD]: {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'pending',
        label: 'Pending Upload',
        color: 'text-warning',
    },
    [JobStatus.UPLOADING]: {
        icon: <Upload className="h-6 w-6" />,
        badgeVariant: 'secondary',
        label: 'Uploading',
        color: 'text-teal-secondary',
    },
    [JobStatus.RETRYING]: {
        icon: <RefreshCcw className="h-6 w-6" />,
        badgeVariant: 'processing',
        label: 'Retrying',
        color: 'text-warning',
    },
    [JobStatus.TORRENT_DOWNLOAD_RETRY]: {
        icon: <RefreshCcw className="h-6 w-6" />,
        badgeVariant: 'processing',
        label: 'Retrying download',
        color: 'text-warning',
    },
    [JobStatus.UPLOAD_RETRY]: {
        icon: <RefreshCcw className="h-6 w-6" />,
        badgeVariant: 'processing',
        label: 'Retrying upload',
        color: 'text-warning',
    },
    [JobStatus.SYNC_RETRY]: {
        icon: <RefreshCcw className="h-6 w-6" />,
        badgeVariant: 'processing',
        label: 'Retrying sync',
        color: 'text-warning',
    },
    [JobStatus.COMPLETED]: {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'default',
        label: 'Completed',
        color: 'text-teal-secondary',
    },
    [JobStatus.FAILED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        label: 'Failed',
        color: 'text-orange',
    },
    [JobStatus.TORRENT_FAILED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        label: 'Download failed',
        color: 'text-orange',
    },
    [JobStatus.UPLOAD_FAILED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        label: 'Upload failed',
        color: 'text-orange',
    },
    [JobStatus.GOOGLE_DRIVE_FAILED]: {
        icon: <AlertCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        label: 'Google Drive upload failed',
        color: 'text-orange',
    },
    [JobStatus.CANCELLED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'secondary',
        label: 'Cancelled',
        color: 'text-muted-foreground',
    },
}

// Timeline item component with date displayed, relative time on hover
function TimelineItem({
    step,
    label,
    date,
    isCompleted = false
}: {
    step: number | string
    label: string
    date: string
    isCompleted?: boolean
}) {
    return (
        <div className="flex items-start gap-3">
            <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                isCompleted
                    ? 'bg-teal-secondary text-gray-900'
                    : 'bg-primary text-primary-foreground'
            )}>
                {step}
            </div>
            <div>
                <p className="text-sm font-medium">{label}</p>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground cursor-help">
                                {formatDateTime(date)}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{formatRelativeTime(date)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default function JobDetailsPage() {
    const params = useParams()
    const jobId = Number(params.id)
    const { data: session } = useSession()

    // Use React Query hook to fetch job details
    const { data: job, isLoading, error, refetch } = useJob(jobId)

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
                        <Link href="/torrents/jobs">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Jobs
                        </Link>
                    </Button>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <p className="text-danger mb-4">
                            {error instanceof Error ? error.message : 'Job not found'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => refetch()} variant="outline" size="sm">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/torrents/jobs">Back to Jobs</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const config = statusConfig[job.status as JobStatus] || statusConfig[JobStatus.QUEUED]
    const isActive = [
        JobStatus.QUEUED,
        JobStatus.DOWNLOADING,
        JobStatus.SYNCING,
        JobStatus.PENDING_UPLOAD,
        JobStatus.UPLOADING,
        JobStatus.TORRENT_DOWNLOAD_RETRY,
        JobStatus.UPLOAD_RETRY,
        JobStatus.SYNC_RETRY
    ].includes(job.status as JobStatus)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/torrents/jobs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Jobs
                    </Link>
                </Button>
            </div>

            {/* Job Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{job.requestFileName || `Job #${job.id}`}</h1>
                    <p className="text-muted-foreground">Job #{job.id}</p>
                    {job.currentState && (
                        <p className="text-sm text-muted-foreground mt-1">{job.currentState}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant={config.badgeVariant} className="text-sm">
                        {config.label}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Progress Card (for active jobs) */}
                    {isActive && (
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
                    )}

                    {/* Error Card (for failed jobs) */}
                    {(job.status === JobStatus.FAILED || 
                      job.status === JobStatus.TORRENT_FAILED || 
                      job.status === JobStatus.UPLOAD_FAILED || 
                      job.status === JobStatus.GOOGLE_DRIVE_FAILED) && job.errorMessage && (
                        <Card className="border-orange/50 bg-orange/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange">
                                    <AlertCircle className="h-5 w-5" />
                                    Error
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm">{job.errorMessage}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Retry Job
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/support">Contact Support</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Success Card (for completed jobs) */}
                    {job.status === JobStatus.COMPLETED && (
                        <Card className="border-teal-secondary/50 bg-teal-secondary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-teal-secondary">
                                    <CheckCircle className="h-5 w-5" />
                                    Download Complete
                                </CardTitle>
                                <CardDescription>
                                    Your files have been uploaded to {job.storageProfileName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href={`https://drive.google.com`} target="_blank">
                                        <HardDrive className="mr-2 h-4 w-4" />
                                        Open in {job.storageProfileName}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Job Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Job ID</p>
                                    <p className="font-medium">#{job.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium">{config.label}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Request File Name</p>
                                    <p className="font-medium">{job.requestFileName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Size</p>
                                    <p className="font-medium">{formatFileSize(job.totalBytes)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Selected Files</p>
                                    <p className="font-medium">
                                        {job.selectedFileIndices.length === 0
                                            ? 'All files'
                                            : `${job.selectedFileIndices.length} file${job.selectedFileIndices.length > 1 ? 's' : ''}`}
                                    </p>
                                    {job.selectedFileIndices.length > 0 && job.selectedFileIndices.length <= 10 && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Indices: {job.selectedFileIndices.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Storage Profile</p>
                                    <p className="font-medium">{job.storageProfileName || 'Unknown'}</p>
                                </div>
                                {job.currentState && (
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-muted-foreground">Current State</p>
                                        <p className="font-medium">{job.currentState}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Storage Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <HardDrive className="h-4 w-4" />
                                Storage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{job.storageProfileName || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">Google Drive</p>
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
                                {job.status !== JobStatus.QUEUED && job.startedAt && (
                                    <TimelineItem
                                        step={2}
                                        label="Started Processing"
                                        date={job.startedAt}
                                    />
                                )}
                                {job.updatedAt && (
                                    <TimelineItem
                                        step={3}
                                        label="Last Updated"
                                        date={job.updatedAt}
                                    />
                                )}
                                {job.status === JobStatus.COMPLETED && job.completedAt && (
                                    <TimelineItem
                                        step="✓"
                                        label="Completed"
                                        date={job.completedAt}
                                        isCompleted
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin-Only Information */}
                    {session?.user?.role === UserRole.Admin && (
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
                    )}
                </div>
            </div>
        </div>
    )
}
