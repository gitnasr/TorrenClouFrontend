'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatFileSize } from '@/lib/utils/formatters'
import type { Job } from '@/types/jobs'
import { getJobStatusConfig } from './JobStatusConfig'
import { JobStatus } from '@/types/enums'

interface JobDetailsCardProps {
    job: Job
}

export function JobDetailsCard({ job }: JobDetailsCardProps) {
    const config = getJobStatusConfig(job.status as JobStatus)

    return (
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
                            {job.selectedFilePaths.length === 0
                                ? 'All files'
                                : `${job.selectedFilePaths.length} file${job.selectedFilePaths.length > 1 ? 's' : ''}`}
                        </p>
                        {job.selectedFilePaths.length > 0 && job.selectedFilePaths.length <= 10 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {job.selectedFilePaths.slice(0, 5).map(p => p.split('/').pop()).join(', ')}{job.selectedFilePaths.length > 5 ? '...' : ''}
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
    )
}



