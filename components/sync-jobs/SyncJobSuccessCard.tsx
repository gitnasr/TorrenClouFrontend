'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import type { SyncJob } from '@/types/sync-jobs'

interface SyncJobSuccessCardProps {
    job: SyncJob
}

export function SyncJobSuccessCard({ job }: SyncJobSuccessCardProps) {
    return (
        <Card className="border-success/50 bg-success/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Sync Completed
                </CardTitle>
                <CardDescription>
                    Files have been successfully synced to {job.destinationType}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

