'use client'

import { useJob } from '@/hooks/useJobs'
import { useJobsStore } from '@/stores/jobsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatFileSize, formatRelativeTime, formatDateTime } from '@/lib/utils/formatters'
import { JobStatus } from '@/types/enums'
import { cn } from '@/lib/utils'
import {
    Clock,
    Download,
    Upload,
    CheckCircle,
    XCircle,
    Ban,
    X,
    HardDrive,
    FileText,
    Calendar,
    Activity,
    AlertCircle,
    Loader2,
    Files,
    Cloud,
    RefreshCw,
} from 'lucide-react'

const statusConfig: Record<JobStatus, {
    icon: React.ReactNode
    label: string
    color: string
    bgColor: string
}> = {
    [JobStatus.QUEUED]: {
        icon: <Clock className="h-5 w-5" />,
        label: 'Queued',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.DOWNLOADING]: {
        icon: <Download className="h-5 w-5" />,
        label: 'Downloading',
        color: 'text-primary',
        bgColor: 'bg-primary/20',
    },
    [JobStatus.PENDING_UPLOAD]: {
        icon: <Clock className="h-5 w-5" />,
        label: 'Pending Upload',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.UPLOADING]: {
        icon: <Upload className="h-5 w-5" />,
        label: 'Uploading',
        color: 'text-info',
        bgColor: 'bg-info/20',
    },
    [JobStatus.TORRENT_DOWNLOAD_RETRY]: {
        icon: <RefreshCw className="h-5 w-5" />,
        label: 'Retrying download',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.UPLOAD_RETRY]: {
        icon: <RefreshCw className="h-5 w-5" />,
        label: 'Retrying upload',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.COMPLETED]: {
        icon: <CheckCircle className="h-5 w-5" />,
        label: 'Completed',
        color: 'text-success',
        bgColor: 'bg-success/20',
    },
    [JobStatus.FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        label: 'Failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.TORRENT_FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        label: 'Download failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.UPLOAD_FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        label: 'Upload failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.GOOGLE_DRIVE_FAILED]: {
        icon: <AlertCircle className="h-5 w-5" />,
        label: 'Google Drive upload failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.CANCELLED]: {
        icon: <Ban className="h-5 w-5" />,
        label: 'Cancelled',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
    },
}

interface DetailRowProps {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
}

function DetailRow({ icon, label, value }: DetailRowProps) {
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

export function JobDetail() {
    const { selectedJobId, setSelectedJobId } = useJobsStore()
    const { data: job, isLoading, error } = useJob(selectedJobId)

    if (!selectedJobId) {
        return (
            <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a job to view details</p>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading job details...</p>
                </CardContent>
            </Card>
        )
    }

    if (error || !job) {
        return (
            <Card className="h-full border-danger/50">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <AlertCircle className="h-12 w-12 text-danger mb-4" />
                    <p className="text-danger mb-2">Failed to load job details</p>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error ? error.message : 'Job not found'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const config = statusConfig[job.status] || statusConfig[JobStatus.QUEUED]

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            config.bgColor,
                            config.color
                        )}>
                            {config.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg">Job #{job.id}</CardTitle>
                            <Badge variant={job.isActive ? 'default' : 'secondary'} className="mt-1">
                                {config.label}
                            </Badge>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedJobId(null)}
                        className="shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Progress Section */}
                {job.isActive && job.totalBytes > 0 && (
                    <div className="space-y-3 p-4 bg-surface-100 rounded-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm font-bold text-primary">
                                {job.progressPercentage.toFixed(1)}%
                            </span>
                        </div>
                        <Progress value={job.progressPercentage} className="h-3" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatFileSize(job.bytesDownloaded)} / {formatFileSize(job.totalBytes)}</span>
                            <span>{formatFileSize(job.totalBytes - job.bytesDownloaded)} remaining</span>
                        </div>
                        {job.currentState && (
                            <p className="text-sm text-muted-foreground italic">
                                {job.currentState}
                            </p>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {job.errorMessage && (
                    <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-danger">Error</p>
                                <p className="text-sm text-danger/80 mt-1">{job.errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <Separator />

                {/* Job Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Details
                    </h3>

                    <div className="grid gap-4">
                        <DetailRow
                            icon={<FileText className="h-4 w-4" />}
                            label="File Name"
                            value={job.requestFileName || 'N/A'}
                        />

                        <DetailRow
                            icon={<HardDrive className="h-4 w-4" />}
                            label="Storage Profile"
                            value={job.storageProfileName || 'Unknown'}
                        />

                        <DetailRow
                            icon={<Activity className="h-4 w-4" />}
                            label="Type"
                            value={job.type}
                        />

                        <DetailRow
                            icon={<Download className="h-4 w-4" />}
                            label="Total Size"
                            value={formatFileSize(job.totalBytes)}
                        />

                        {job.selectedFilePaths.length > 0 && (
                            <DetailRow
                                icon={<Files className="h-4 w-4" />}
                                label="Selected Files"
                                value={`${job.selectedFilePaths.length} file(s)`}
                            />
                        )}
                    </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Timeline
                    </h3>

                    <div className="grid gap-4">
                        <DetailRow
                            icon={<Calendar className="h-4 w-4" />}
                            label="Created"
                            value={formatDateTime(job.createdAt)}
                        />

                        {job.startedAt && (
                            <DetailRow
                                icon={<Clock className="h-4 w-4" />}
                                label="Started"
                                value={formatRelativeTime(job.startedAt)}
                            />
                        )}

                        {job.completedAt && (
                            <DetailRow
                                icon={<CheckCircle className="h-4 w-4" />}
                                label="Completed"
                                value={formatRelativeTime(job.completedAt)}
                            />
                        )}

                        {job.lastHeartbeat && job.isActive && (
                            <DetailRow
                                icon={<Activity className="h-4 w-4" />}
                                label="Last Update"
                                value={formatRelativeTime(job.lastHeartbeat)}
                            />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
