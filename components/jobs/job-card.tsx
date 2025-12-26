'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatFileSize, formatRelativeTime } from '@/lib/utils/formatters'
import { JobStatus } from '@/types/enums'
import type { UserJob } from '@/types/api'
import {
    Clock,
    Download,
    Upload,
    CheckCircle,
    XCircle,
    Ban,
    ChevronRight,
    FolderOpen,
    HardDrive,
    FileText,
    RefreshCw,
    Cloud,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { JobCardProps, JobListProps } from '@/types/jobs'


const statusConfig: Record<JobStatus, {
    icon: React.ReactNode
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'warning' | 'processing' | 'pending' | 'success'
    label: string
    color: string
    bgColor: string
}> = {
    [JobStatus.QUEUED]: {
        icon: <Clock className="h-5 w-5" />,
        badgeVariant: 'pending',
        label: 'Queued',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.DOWNLOADING]: {
        icon: <Download className="h-5 w-5" />,
        badgeVariant: 'processing',
        label: 'Downloading',
        color: 'text-primary',
        bgColor: 'bg-primary/20',
    },
    [JobStatus.PENDING_UPLOAD]: {
        icon: <Clock className="h-5 w-5" />,
        badgeVariant: 'pending',
        label: 'Pending Upload',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.UPLOADING]: {
        icon: <Upload className="h-5 w-5" />,
        badgeVariant: 'secondary',
        label: 'Uploading',
        color: 'text-info',
        bgColor: 'bg-info/20',
    },
    [JobStatus.TORRENT_DOWNLOAD_RETRY]: {
        icon: <RefreshCw className="h-5 w-5" />,
        badgeVariant: 'processing',
        label: 'Retrying download',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.UPLOAD_RETRY]: {
        icon: <RefreshCw className="h-5 w-5" />,
        badgeVariant: 'processing',
        label: 'Retrying upload',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [JobStatus.COMPLETED]: {
        icon: <CheckCircle className="h-5 w-5" />,
        badgeVariant: 'success',
        label: 'Completed',
        color: 'text-success',
        bgColor: 'bg-success/20',
    },
    [JobStatus.FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        badgeVariant: 'destructive',
        label: 'Failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.TORRENT_FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        badgeVariant: 'destructive',
        label: 'Download failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.UPLOAD_FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        badgeVariant: 'destructive',
        label: 'Upload failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.GOOGLE_DRIVE_FAILED]: {
        icon: <AlertCircle className="h-5 w-5" />,
        badgeVariant: 'destructive',
        label: 'Google Drive upload failed',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
    [JobStatus.CANCELLED]: {
        icon: <Ban className="h-5 w-5" />,
        badgeVariant: 'secondary',
        label: 'Cancelled',
        color: 'text-surface-50',
        bgColor: 'bg-surface-300',
    },
}

export function JobCard({ job, className }: JobCardProps) {
    const config = statusConfig[job.status]
    const isActive = [
        JobStatus.QUEUED,
        JobStatus.DOWNLOADING,
        JobStatus.PENDING_UPLOAD,
        JobStatus.UPLOADING,
        JobStatus.TORRENT_DOWNLOAD_RETRY,
        JobStatus.UPLOAD_RETRY
    ].includes(job.status)

    return (
        <Link href={`/jobs/${job.id}`}>
            <div className={cn(
                'group relative transition-all duration-200 hover:bg-surface-400/50',
                'border-b border-surface-300/50',
                'pl-1',
                className
            )}>
                {/* Left status indicator - straight line, no curve */}
                <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-1',
                    isActive && 'bg-info',
                    job.status === JobStatus.COMPLETED && 'bg-success',
                    (job.status === JobStatus.FAILED ||
                        job.status === JobStatus.TORRENT_FAILED ||
                        job.status === JobStatus.UPLOAD_FAILED ||
                        job.status === JobStatus.GOOGLE_DRIVE_FAILED) && 'bg-danger',
                    job.status === JobStatus.CANCELLED && 'bg-surface-200'
                )} />

                <div className={cn(
                    'p-5',
                    isActive && 'bg-info/5'
                )}>
                    <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                            config.bgColor,
                            config.color
                        )}>
                            {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* Title Row */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                        {job.fileName || `Job #${job.id}`}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <FileText className="h-3.5 w-3.5" />
                                            {formatFileSize(job.totalBytes)}
                                        </span>
                                        {job.selectedFilePaths.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                {job.selectedFilePaths.length} file{job.selectedFilePaths.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <HardDrive className="h-3.5 w-3.5" />
                                            {job.storageProfileName || 'Unknown'}
                                        </span>
                                        <span>
                                            {formatRelativeTime(job.createdAt || job.startedAt || new Date().toISOString())}
                                        </span>
                                    </div>
                                    {job.currentState && (
                                        <p className="text-sm text-muted-foreground mt-1">{job.currentState}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant={config.badgeVariant}>{config.label}</Badge>
                                    {job.isRefunded && (
                                        <Badge variant="secondary">Refunded</Badge>
                                    )}
                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </div>

                            {/* Progress Bar for Active Jobs */}
                            {isActive && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {job.currentState || config.label}
                                        </span>
                                        <span className="font-medium text-primary">{job.progress.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={job.progress} className="h-2" />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatFileSize(job.bytesDownloaded)} downloaded</span>
                                        <span>{formatFileSize(job.totalBytes - job.bytesDownloaded)} remaining</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export function JobList({
    jobs,
    title = 'Recent Jobs',
    limit,
    showViewAll = true,
    emptyMessage = 'No jobs yet',
    className,
}: JobListProps) {
    const displayedJobs = limit ? jobs.slice(0, limit) : jobs

    return (
        <Card className={className}>
            <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {showViewAll && jobs.length > 0 && (
                    <Link href="/jobs" className="text-sm text-primary hover:underline">
                        View All
                    </Link>
                )}
            </div>
            <CardContent className="pt-0">
                {displayedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FolderOpen className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">{emptyMessage}</p>
                        <Button asChild variant="outline" size="sm" className="mt-4">
                            <Link href="/torrents/upload">Upload Torrent</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayedJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
