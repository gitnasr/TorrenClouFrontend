'use client'

import { formatFileSize } from '@/lib/utils/formatters'
import type { Job } from '@/types/jobs'
import { getJobStatusConfig } from './JobStatusConfig'
import { JobStatus } from '@/types/enums'

interface JobDetailsCardProps {
    job: Job
}

function MetaField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className="text-sm font-mono text-foreground break-all">{value}</p>
        </div>
    )
}

export function JobDetailsCard({ job }: JobDetailsCardProps) {
    const config = getJobStatusConfig(job.status as JobStatus)

    const selectedFilesLabel =
        !job.selectedFilePaths || job.selectedFilePaths.length === 0
            ? 'All files'
            : `${job.selectedFilePaths.length} file${job.selectedFilePaths.length > 1 ? 's' : ''}`

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
                <h3 className="text-base font-semibold">Job Metadata</h3>
            </div>

            {/* Details grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <MetaField label="Job ID" value={`#${job.id}`} />
                <MetaField label="Status" value={config.label} />
                <MetaField label="Torrent Name" value={job.requestFileName || '—'} />
                <MetaField label="Total Size" value={formatFileSize(job.totalBytes)} />
                <MetaField label="Selected Files" value={selectedFilesLabel} />
                <MetaField label="Storage Profile" value={job.storageProfileName || 'Unknown'} />
                {job.currentState && (
                    <div className="sm:col-span-2">
                        <MetaField label="Current State" value={job.currentState} />
                    </div>
                )}
            </div>
        </div>
    )
}



