'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StorageErrorStateProps {
    error?: Error | string | null
    backHref?: string
}

export function StorageErrorState({ 
    error, 
    backHref = '/storage' 
}: StorageErrorStateProps) {
    const errorMessage = error instanceof Error 
        ? error.message 
        : error || 'Profile not found'

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>
            <Card className="border-danger/50">
                <CardContent className="p-6 text-center">
                    <p className="text-danger">{errorMessage}</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href={backHref}>Back to Storage</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}



