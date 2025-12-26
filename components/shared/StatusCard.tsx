'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface StatusConfig {
    icon: ReactNode
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'processing' | 'pending'
    color: string
    bgColor?: string
}

interface StatusCardProps {
    status: string
    config: StatusConfig
    description?: string
    className?: string
    children?: ReactNode
}

export function StatusCard({
    status,
    config,
    description,
    className,
    children,
}: StatusCardProps) {
    return (
        <Card className={className}>
            <CardContent className="flex items-center gap-4 pt-6">
                <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    config.color,
                    config.bgColor
                )}>
                    {config.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{status}</h2>
                        <Badge variant={config.badgeVariant}>{status}</Badge>
                    </div>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {children}
            </CardContent>
        </Card>
    )
}

