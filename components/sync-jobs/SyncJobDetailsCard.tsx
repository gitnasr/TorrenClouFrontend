'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { formatFileSize } from '@/lib/utils/formatters'
import Link from 'next/link'
import type { SyncJob } from '@/types/sync-jobs'

interface SyncJobDetailsCardProps {
    job: SyncJob
}

export function SyncJobDetailsCard({ job }: SyncJobDetailsCardProps) {
    return (
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
    )
}

