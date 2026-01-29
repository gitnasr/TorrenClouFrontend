'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HardDrive } from 'lucide-react'
import type { Job } from '@/types/jobs'

interface JobStorageInfoProps {
    job: Job
}

export function JobStorageInfo({ job }: JobStorageInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <HardDrive className="h-4 w-4" />
                    Storage
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-medium">{job.storageProfileName || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">Google Drive</p>
            </CardContent>
        </Card>
    )
}



