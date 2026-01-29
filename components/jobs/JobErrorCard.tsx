'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Job } from '@/types/jobs'

interface JobErrorCardProps {
    job: Job
    onRetry?: () => void
    isRetrying?: boolean
}

export function JobErrorCard({
    job,
    onRetry,
    isRetrying,
}: JobErrorCardProps) {
    return (
        <Card className="border-orange/50 bg-orange/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange">
                    <AlertCircle className="h-5 w-5" />
                    Error
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm">{job.errorMessage}</p>
                <div className="flex gap-2">
                    {job.canRetry && onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            disabled={isRetrying}
                        >
                            {isRetrying ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="mr-2 h-4 w-4" />
                            )}
                            Retry Job
                        </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/support">Contact Support</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
