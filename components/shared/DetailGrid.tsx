'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface DetailItem {
    label: string
    value: ReactNode
    icon?: ReactNode
    colSpan?: 1 | 2
}

interface DetailGridProps {
    title?: string
    items: DetailItem[]
    columns?: 1 | 2
    className?: string
}

export function DetailGrid({
    title,
    items,
    columns = 2,
    className,
}: DetailGridProps) {
    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={cn(!title && 'pt-6')}>
                <div className={cn(
                    'grid gap-4',
                    columns === 2 && 'sm:grid-cols-2'
                )}>
                    {items.map((item, index) => (
                        <div 
                            key={index} 
                            className={cn(
                                item.colSpan === 2 && 'sm:col-span-2'
                            )}
                        >
                            <div className="flex items-start gap-2">
                                {item.icon && (
                                    <div className="text-muted-foreground mt-0.5">
                                        {item.icon}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="font-medium truncate">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// Simplified detail row component for inline use
interface DetailRowProps {
    icon?: ReactNode
    label: string
    value: ReactNode
}

export function DetailRow({ icon, label, value }: DetailRowProps) {
    return (
        <div className="flex items-start gap-3">
            {icon && (
                <div className="text-muted-foreground mt-0.5">{icon}</div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium truncate">{value}</p>
            </div>
        </div>
    )
}

