'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageHeaderProps {
    title: string
    description?: string
    backHref?: string
    backLabel?: string
    action?: ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    backHref,
    backLabel = 'Back',
    action,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {backHref && (
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={backHref}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {backLabel}
                        </Link>
                    </Button>
                </div>
            )}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>
        </div>
    )
}

