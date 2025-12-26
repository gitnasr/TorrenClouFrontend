'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, HardDrive } from 'lucide-react'
import Link from 'next/link'
import type { Job } from '@/types/jobs'

interface JobSuccessCardProps {
    job: Job
}

export function JobSuccessCard({ job }: JobSuccessCardProps) {
    return (
        <Card className="border-teal-secondary/50 bg-teal-secondary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-secondary">
                    <CheckCircle className="h-5 w-5" />
                    Download Complete
                </CardTitle>
                <CardDescription>
                    Your files have been uploaded to {job.storageProfileName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="https://drive.google.com" target="_blank">
                        <HardDrive className="mr-2 h-4 w-4" />
                        Open in {job.storageProfileName}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

