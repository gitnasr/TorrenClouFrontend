'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface DepositErrorStateProps {
    onRetry?: () => void
    backHref?: string
}

export function DepositErrorState({ 
    onRetry, 
    backHref = '/wallet/deposits' 
}: DepositErrorStateProps) {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Deposit Details</h1>
                    <p className="text-muted-foreground">View deposit information</p>
                </div>
            </div>
            <Card className="border-destructive bg-destructive/10">
                <CardContent className="flex items-center gap-3 pt-6">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div className="flex-1">
                        <p className="text-destructive font-medium">
                            Failed to load deposit details
                        </p>
                        <p className="text-sm text-muted-foreground">
                            The deposit may not exist or you don&apos;t have access to it.
                        </p>
                    </div>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            Retry
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

