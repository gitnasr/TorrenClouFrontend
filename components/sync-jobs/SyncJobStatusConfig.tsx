import { Cloud, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { SyncStatus } from '@/types/enums'
import { ReactNode } from 'react'

export interface SyncJobStatusConfigItem {
    icon: ReactNode
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'warning' | 'processing' | 'pending' | 'success'
    color: string
    bgColor: string
}

export const syncJobStatusConfig: Record<SyncStatus, SyncJobStatusConfigItem> = {
    [SyncStatus.NOT_STARTED]: {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'pending',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
    },
    [SyncStatus.SYNCING]: {
        icon: <Cloud className="h-6 w-6" />,
        badgeVariant: 'processing',
        color: 'text-info',
        bgColor: 'bg-info/20',
    },
    [SyncStatus.SYNC_RETRY]: {
        icon: <RefreshCw className="h-6 w-6" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
    },
    [SyncStatus.COMPLETED]: {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'success',
        color: 'text-success',
        bgColor: 'bg-success/20',
    },
    [SyncStatus.FAILED]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-danger',
        bgColor: 'bg-danger/20',
    },
}

export function getSyncJobStatusConfig(status: SyncStatus): SyncJobStatusConfigItem {
    return syncJobStatusConfig[status]
}

// Active sync job statuses
export const ACTIVE_SYNC_STATUSES = [SyncStatus.SYNCING, SyncStatus.SYNC_RETRY]

// Helper to check if a sync job is active
export function isSyncJobActive(status: SyncStatus): boolean {
    return ACTIVE_SYNC_STATUSES.includes(status)
}

