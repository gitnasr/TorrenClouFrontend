'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { SyncStatus } from '@/types/enums'
import { syncStatusLabels } from '@/types/sync-jobs'
import type { SyncJob } from '@/types/sync-jobs'
import { getSyncJobStatusConfig } from './SyncJobStatusConfig'

interface SyncJobHeaderProps {
    job: SyncJob
    onRefresh?: () => void
}

export function SyncJobHeader({ job, onRefresh }: SyncJobHeaderProps) {
    const config = getSyncJobStatusConfig(job.status)

    return (
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                    {job.requestFileName || `Sync Job #${job.id}`}
                </h1>
                <p className="text-muted-foreground">Sync Job #{job.id}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Badge variant={config.badgeVariant} className="text-sm">
                    {syncStatusLabels[job.status]}
                </Badge>
                {onRefresh && (
                    <Button onClick={onRefresh} variant="ghost" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                )}
            </div>
        </div>
    )
}

