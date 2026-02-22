'use client'

import { formatFileSize } from '@/lib/utils/formatters'
import type { Job } from '@/types/jobs'
import { JobStatus } from '@/types/enums'
import { Download, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobProgressCardProps {
    job: Job
}

export function JobProgressCard({ job }: JobProgressCardProps) {
    const status = job.status as JobStatus

    const isDownloading = [JobStatus.DOWNLOADING, JobStatus.TORRENT_DOWNLOAD_RETRY].includes(status)
    const isUploading = [JobStatus.UPLOADING, JobStatus.UPLOAD_RETRY, JobStatus.GOOGLE_DRIVE_FAILED].includes(status)
    const isPastDownload = [
        JobStatus.PENDING_UPLOAD,
        JobStatus.UPLOADING,
        JobStatus.UPLOAD_RETRY,
        JobStatus.GOOGLE_DRIVE_FAILED,
        JobStatus.COMPLETED,
    ].includes(status)
    const isCompleted = status === JobStatus.COMPLETED

    const downloadPct = isCompleted || isPastDownload ? 100 : isDownloading ? job.progressPercentage : 0
    const uploadPct = isCompleted ? 100 : isUploading ? job.progressPercentage : 0

    const downloadLabel = downloadPct === 100 ? 'Completed' : isDownloading ? 'In Progress' : 'Pending'
    const uploadLabel = uploadPct === 100 ? 'Completed' : isUploading ? 'Uploading' : 'Pending'

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download card */}
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-3 right-3 opacity-[0.07] pointer-events-none">
                    <Download className="h-16 w-16" />
                </div>
                <div className="relative flex flex-col gap-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                Download
                            </p>
                            <p className="text-2xl font-bold font-mono">
                                {downloadPct.toFixed(0)}%
                            </p>
                        </div>
                        <p className={cn(
                            'text-sm font-medium font-mono',
                            downloadPct === 100 ? 'text-primary' : 'text-info-medium'
                        )}>
                            {downloadLabel}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${downloadPct}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                        <span>
                            {formatFileSize(job.bytesDownloaded)} / {formatFileSize(job.totalBytes)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Upload card */}
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-3 right-3 opacity-[0.07] pointer-events-none">
                    <Upload className="h-16 w-16" />
                </div>
                <div className="relative flex flex-col gap-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                Upload
                            </p>
                            <p className="text-2xl font-bold font-mono">
                                {uploadPct.toFixed(0)}%
                            </p>
                        </div>
                        <p className={cn(
                            'text-sm font-medium font-mono',
                            uploadPct === 100 ? 'text-primary' : isUploading ? 'text-info-medium' : 'text-muted-foreground'
                        )}>
                            {uploadLabel}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-500 relative',
                                uploadPct === 100 ? 'bg-primary' : 'bg-info-medium'
                            )}
                            style={{ width: `${uploadPct}%` }}
                        >
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                        <span>
                            {formatFileSize(isUploading ? job.bytesDownloaded : 0)} / {formatFileSize(job.totalBytes)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}



