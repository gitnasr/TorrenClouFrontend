'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
    error?: Error | string | null
    title?: string
    description?: string
    onRetry?: () => void
    backHref?: string
    backLabel?: string
    className?: string
}

export function ErrorState({
    error,
    title = 'Something went wrong',
    description,
    onRetry,
    backHref,
    backLabel = 'Go Back',
    className,
}: ErrorStateProps) {
    const errorMessage = error instanceof Error 
        ? error.message 
        : error || description || 'An unexpected error occurred'

    return (
        <Card className={cn('border-danger/50', className)}>
            <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground mb-4">{errorMessage}</p>
                <div className="flex gap-2 justify-center">
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                    )}
                    {backHref && (
                        <Button asChild variant="outline" size="sm">
                            <Link href={backHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {backLabel}
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}



