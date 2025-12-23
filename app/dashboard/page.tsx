'use client'

import { BalanceCard } from '@/components/wallet/balance-card'
import { TransactionList } from '@/components/wallet/transaction-list'
import { JobList, JobCard } from '@/components/jobs/job-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FolderOpen, HardDrive, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  mockWalletBalance,
  mockTransactions,
} from '@/lib/mockData'
import { useJobs, useJobStatistics } from '@/hooks/useJobs'
import { useJobsStore } from '@/stores/jobsStore'
import type { UserJob } from '@/types/api'
import type { Job } from '@/types/jobs'
import { JobStatus } from '@/types/enums'
import { useEffect } from 'react'

// Adapter function to convert Job to UserJob format for JobCard
function toUserJob(job: Job): UserJob {
  return {
    id: job.id,
    userId: 0,
    storageProfileId: job.storageProfileId,
    status: job.status as JobStatus,
    type: job.type as any,
    requestFileId: job.requestFileId,
    errorMessage: job.errorMessage ?? undefined,
    currentState: job.currentState ?? undefined,
    startedAt: job.startedAt ?? undefined,
    completedAt: job.completedAt ?? undefined,
    lastHeartbeat: job.lastHeartbeat ?? undefined,
    bytesDownloaded: job.bytesDownloaded,
    totalBytes: job.totalBytes,
    selectedFilePaths: job.selectedFilePaths,
    progress: job.progressPercentage,
    fileName: job.requestFileName ?? undefined,
    storageProfileName: job.storageProfileName ?? undefined,
  }
}

export default function DashboardPage() {
  // Set page size to 3 for dashboard
  const { setPageSize, setSelectedStatus } = useJobsStore()

  useEffect(() => {
    // Reset to show all statuses and limit to 3
    setSelectedStatus(null)
    setPageSize(3)
  }, [setPageSize, setSelectedStatus])

  // Fetch recent jobs (limited to 3)
  const { data: jobsData, isLoading: jobsLoading } = useJobs()

  // Fetch job statistics from dedicated endpoint
  const { data: jobStats, isLoading: statsLoading } = useJobStatistics()

  // Get recent 3 jobs regardless of status
  const recentJobs = jobsData?.items.slice(0, 3) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BalanceCard
          balance={mockWalletBalance.balance}
          changeAmount={25.50}
          changePercentage={19.5}
        />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold">{jobStats?.activeJobs ?? 0}</p>
                <p className="text-sm text-muted-foreground">
                  {jobStats?.completedJobs ?? 0} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto flex-col gap-2 py-4">
              <Link href="/torrents/upload">
                <Upload className="h-6 w-6" />
                <span>Upload Torrent</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/jobs">
                <FolderOpen className="h-6 w-6" />
                <span>View Jobs</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/storage">
                <HardDrive className="h-6 w-6" />
                <span>Manage Storage</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/invoices">
                <FileText className="h-6 w-6" />
                <span>View Invoices</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Jobs (3 most recent regardless of status) */}
        <Card>
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-lg font-semibold">Recent Jobs</h2>
            {recentJobs.length > 0 && (
              <Link href="/torrents/jobs" className="text-sm text-primary hover:underline">
                View All
              </Link>
            )}
          </div>
          <CardContent className="pt-0">
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No jobs yet. Upload a torrent to get started!</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/torrents/upload">Upload Torrent</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <JobCard key={job.id} job={toUserJob(job)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <TransactionList
          transactions={mockTransactions}
          limit={5}
        />
      </div>
    </div>
  )
}
