'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ErrorState } from '@/components/shared'

interface JobErrorStateProps {
    error?: Error | string | null
    onRetry?: () => void
    backHref?: string
}

export function JobErrorState({
    error,
    onRetry,
    backHref = '/jobs',
}: JobErrorStateProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Jobs
                    </Link>
                </Button>
            </div>
            <ErrorState
                error={error}
                title="Job not found"
                onRetry={onRetry}
                backHref={backHref}
                backLabel="Back to Jobs"
            />
        </div>
    )
}



