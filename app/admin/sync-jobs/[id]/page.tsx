'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSyncJob } from '@/hooks/useSyncJobs'
import { SyncStatus } from '@/types/enums'
import Link from 'next/link'
import { LoadingState } from '@/components/shared'
import {
    SyncJobHeader,
    SyncJobProgressCard,
    SyncJobErrorCard,
    SyncJobSuccessCard,
    SyncJobDetailsCard,
    SyncJobStatusCard,
    SyncJobTimelineCard,
    SyncJobErrorState,
    isSyncJobActive,
} from '@/components/sync-jobs'

export default function SyncJobDetailPage() {
    const params = useParams()
    const syncJobId = Number(params.id)

    const { data: job, isLoading, error, refetch } = useSyncJob(syncJobId)

    // Loading state
    if (isLoading) {
        return <LoadingState message="Loading sync job..." />
    }

    // Error state
    if (error || !job) {
        return (
            <SyncJobErrorState
                error={error}
                onRetry={() => refetch()}
            />
        )
    }

    const isActive = isSyncJobActive(job.status)

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
            <SyncJobHeader job={job} onRefresh={() => refetch()} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Progress Card (for active jobs) */}
                    {isActive && <SyncJobProgressCard job={job} />}

                    {/* Error Card (for failed jobs) */}
                    {job.status === SyncStatus.FAILED && <SyncJobErrorCard job={job} />}

                    {/* Success Card (for completed jobs) */}
                    {job.status === SyncStatus.COMPLETED && <SyncJobSuccessCard job={job} />}

                    {/* Job Details */}
                    <SyncJobDetailsCard job={job} />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <SyncJobStatusCard job={job} />

                    {/* Timeline */}
                    <SyncJobTimelineCard job={job} />
                </div>
            </div>
        </div>
    )
}
