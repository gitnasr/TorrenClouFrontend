'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import {
    Cloud,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    AlertCircle,
    ChevronRight,
    HardDrive,
    FileText,
} from 'lucide-react'
import { formatFileSize, formatRelativeTime } from '@/lib/utils/formatters'
import { useSyncJobs, useSyncJobStatistics } from '@/hooks/useSyncJobs'
import { SyncStatus } from '@/types/enums'
import { syncStatusLabels } from '@/types/sync-jobs'
import type { SyncJob } from '@/types/sync-jobs'
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
        icon: <Clock className="h-5 w-5" />,
        badgeVariant: 'pending',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
    },
    [SyncStatus.SYNCING]: {
        icon: <Cloud className="h-5 w-5" />,
        badgeVariant: 'processing',
        color: 'text-info',
        bgColor: 'bg-info/20',
    },
    [SyncStatus.SYNC_RETRY]: {
        icon: <RefreshCw className="h-5 w-5" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [SyncStatus.COMPLETED]: {
        icon: <CheckCircle className="h-5 w-5" />,
        badgeVariant: 'success',
        color: 'text-success',
        bgColor: 'bg-success/20',
    },
    [SyncStatus.FAILED]: {
        icon: <XCircle className="h-5 w-5" />,
        badgeVariant: 'destructive',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
}

// Status filter options
const statusFilters = [
    { label: 'All', value: null },
    { label: 'Not Started', value: SyncStatus.NOT_STARTED },
    { label: 'Syncing', value: SyncStatus.SYNCING },
    { label: 'Retrying', value: SyncStatus.SYNC_RETRY },
    { label: 'Completed', value: SyncStatus.COMPLETED },
    { label: 'Failed', value: SyncStatus.FAILED },
]

// Sync job card component
function SyncJobCard({ job }: { job: SyncJob }) {
    const config = statusConfig[job.status]
    const isActive = job.status === SyncStatus.SYNCING || job.status === SyncStatus.SYNC_RETRY

    return (
        <Link href={`/admin/sync-jobs/${job.id}`}>
            <Card className={cn(
                'hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer',
                isActive && 'border-l-4 border-l-info',
                job.status === SyncStatus.COMPLETED && 'border-l-4 border-l-success',
                job.status === SyncStatus.FAILED && 'border-l-4 border-l-danger'
            )}>
                <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
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
                                    <h3 className="font-semibold text-base truncate">
                                        {job.requestFileName || `Sync Job #${job.id}`}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <FileText className="h-3.5 w-3.5" />
                                            {formatFileSize(job.totalBytes)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HardDrive className="h-3.5 w-3.5" />
                                            {job.storageProfileName || job.destinationType}
                                        </span>
                                        <span>
                                            {job.startedAt
                                                ? formatRelativeTime(job.startedAt)
                                                : formatRelativeTime(job.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant={config.badgeVariant}>
                                        {syncStatusLabels[job.status]}
                                    </Badge>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>

                            {/* Progress for active jobs */}
                            {isActive && job.totalBytes > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Syncing to {job.destinationType}...
                                        </span>
                                        <span className="font-medium text-info">
                                            {job.progress.toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress value={job.progress} className="h-2" />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatFileSize(job.bytesTransferred)} transferred</span>
                                        <span>{formatFileSize(job.totalBytes - job.bytesTransferred)} remaining</span>
                                    </div>
                                </div>
                            )}

                            {/* Error message */}
                            {job.errorMessage && (
                                <div className="flex items-start gap-2 p-2 bg-danger/10 border border-danger/20 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                                    <p className="text-sm text-danger truncate">{job.errorMessage}</p>
                                </div>
                            )}

                            {/* Retry info */}
                            {job.retryCount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Retry attempt: {job.retryCount}
                                    {job.nextRetryAt && ` • Next retry: ${formatRelativeTime(job.nextRetryAt)}`}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function AdminSyncJobsPage() {
    const [selectedStatus, setSelectedStatus] = useState<SyncStatus | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Fetch data
    const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch } = useSyncJobs({
        pageNumber: currentPage,
        pageSize,
        status: selectedStatus ?? undefined,
    })
    const { data: stats, isLoading: statsLoading } = useSyncJobStatistics()

    // Handle status filter change
    const handleStatusChange = (status: SyncStatus | null) => {
        setSelectedStatus(status)
        setCurrentPage(1)
    }

    // Loading state
    if (jobsLoading && !jobsData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Error state
    if (jobsError) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sync Jobs</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage background sync operations
                    </p>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <p className="text-danger mb-4">
                            {jobsError instanceof Error ? jobsError.message : 'Failed to load sync jobs'}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sync Jobs</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage background sync operations
                    </p>
                </div>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total</p>
                                <p className="text-3xl font-bold mt-1">
                                    {statsLoading ? '...' : stats?.totalJobs ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Cloud className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Syncing</p>
                                <p className="text-3xl font-bold mt-1 text-info">
                                    {statsLoading ? '...' : stats?.syncing ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center">
                                <Cloud className="h-6 w-6 text-info" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Retrying</p>
                                <p className="text-3xl font-bold mt-1 text-warning">
                                    {statsLoading ? '...' : stats?.retrying ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                                <RefreshCw className="h-6 w-6 text-warning" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <p className="text-3xl font-bold mt-1 text-success">
                                    {statsLoading ? '...' : stats?.completed ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-danger/5 to-danger/10 border-danger/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                                <p className="text-3xl font-bold mt-1 text-danger">
                                    {statsLoading ? '...' : stats?.failed ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-danger/20 flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-danger" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-2 flex-wrap">
                        {statusFilters.map((filter) => (
                            <Button
                                key={filter.label}
                                variant={selectedStatus === filter.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusChange(filter.value)}
                                className={cn(
                                    selectedStatus === filter.value && 'shadow-md'
                                )}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Jobs List */}
            {!jobsData || jobsData.items.length === 0 ? (
                <EmptyState
                    icon={Cloud}
                    title="No sync jobs found"
                    description={
                        selectedStatus
                            ? "Try adjusting your filters"
                            : "Sync jobs appear here when files are being transferred to cloud storage"
                    }
                />
            ) : (
                <div className="space-y-4">
                    {jobsData.items.map((job) => (
                        <SyncJobCard key={job.id} job={job} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {jobsData && jobsData.totalCount > 0 && (
                <Pagination
                    totalItems={jobsData.totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size)
                        setCurrentPage(1)
                    }}
                />
            )}
        </div>
    )
}
