'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
    useJob,
    useRetryJob,
    useCancelJob,
    useRefundJob,
    useAdminRetryJob,
    useAdminCancelJob,
} from '@/hooks/useJobs'
import { JobStatus, UserRole } from '@/types/enums'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useJobsStore } from '@/stores/jobsStore'
import {
    JobTimeline,
    JobHeader,
    JobProgressCard,
    JobErrorCard,
    JobSuccessCard,
    JobDetailsCard,
    JobStorageInfo,
    JobAdminInfo,
    JobCancelModal,
    JobRefundModal,
    JobLoadingState,
    JobErrorState,
    isJobActive,
    isJobFailed,
} from '@/components/jobs'

export default function JobDetailsPage() {
    const params = useParams()
    const jobId = Number(params.id)
    const { data: session } = useSession()
    const { setShowCancelModal, setShowRefundModal } = useJobsStore()

    // Use React Query hook to fetch job details
    const { data: job, isLoading, error, refetch } = useJob(jobId)

    // Mutation hooks - use admin endpoints if user is admin
    const isAdmin = session?.user?.role === UserRole.Admin
    const retryJobMutation = useRetryJob()
    const cancelJobMutation = useCancelJob()
    const refundJobMutation = useRefundJob()
    const adminRetryJobMutation = useAdminRetryJob()
    const adminCancelJobMutation = useAdminCancelJob()

    // Use admin or user mutations based on role
    const handleRetry = () => {
        if (isAdmin) {
            adminRetryJobMutation.mutate(jobId)
        } else {
            retryJobMutation.mutate(jobId)
        }
    }

    const handleCancel = () => {
        if (isAdmin) {
            adminCancelJobMutation.mutate(jobId, {
                onSuccess: () => setShowCancelModal(false),
            })
        } else {
            cancelJobMutation.mutate(jobId, {
                onSuccess: () => setShowCancelModal(false),
            })
        }
    }

    const handleRefund = () => {
        refundJobMutation.mutate(jobId, {
            onSuccess: () => setShowRefundModal(false),
        })
    }

    // Check if any mutation is pending
    const isRetrying = retryJobMutation.isPending || adminRetryJobMutation.isPending
    const isCancelling = cancelJobMutation.isPending || adminCancelJobMutation.isPending
    const isRefunding = refundJobMutation.isPending

    // Loading state
    if (isLoading) {
        return <JobLoadingState />
    }

    // Error state
    if (error || !job) {
        return (
            <JobErrorState
                error={error}
                onRetry={() => refetch()}
            />
        )
    }

    const jobIsActive = isJobActive(job.status as JobStatus)
    const jobHasFailed = isJobFailed(job.status as JobStatus)

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/jobs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Jobs
                    </Link>
                </Button>
            </div>

            {/* Job Header */}
            <JobHeader
                job={job}
                onRetry={handleRetry}
                isRetrying={isRetrying}
                isCancelling={isCancelling}
                isRefunding={isRefunding}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Progress Card (for active jobs) */}
                    {jobIsActive && <JobProgressCard job={job} />}

                    {/* Error Card (for failed jobs) */}
                    {jobHasFailed && job.errorMessage && (
                        <JobErrorCard
                            job={job}
                            onRetry={handleRetry}
                            onRefund={() => setShowRefundModal(true)}
                            isRetrying={isRetrying}
                            isRefunding={isRefunding}
                        />
                    )}

                    {/* Success Card (for completed jobs) */}
                    {job.status === JobStatus.COMPLETED && <JobSuccessCard job={job} />}

                    {/* Job Details */}
                    <JobDetailsCard job={job} />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Storage Info */}
                    <JobStorageInfo job={job} />

                    {/* Timeline */}
                    <JobTimeline jobId={jobId} />

                    {/* Admin-Only Information */}
                    {isAdmin && <JobAdminInfo job={job} />}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <JobCancelModal
                job={job}
                onConfirm={handleCancel}
                loading={isCancelling}
            />

            {/* Refund Confirmation Modal */}
            <JobRefundModal
                job={job}
                onConfirm={handleRefund}
                loading={isRefunding}
            />
        </div>
    )
}
