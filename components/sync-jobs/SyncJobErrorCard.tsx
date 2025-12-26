'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { SyncJob } from '@/types/sync-jobs'

interface SyncJobErrorCardProps {
    job: SyncJob
}

export function SyncJobErrorCard({ job }: SyncJobErrorCardProps) {
    if (!job.errorMessage) return null

    return (
        <Card className="border-danger/50 bg-danger/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-danger">
                    <AlertCircle className="h-5 w-5" />
                    Sync Failed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{job.errorMessage}</p>
            </CardContent>
        </Card>
    )
}

