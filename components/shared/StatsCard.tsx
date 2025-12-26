'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    color: 'primary' | 'info' | 'success' | 'danger' | 'warning'
    loading?: boolean
    className?: string
}

const colorClasses = {
    primary: {
        gradient: 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20',
        text: 'text-primary',
        iconBg: 'bg-primary/20',
    },
    info: {
        gradient: 'bg-gradient-to-br from-info/5 to-info/10 border-info/20',
        text: 'text-info',
        iconBg: 'bg-info/20',
    },
    success: {
        gradient: 'bg-gradient-to-br from-success/5 to-success/10 border-success/20',
        text: 'text-success',
        iconBg: 'bg-success/20',
    },
    danger: {
        gradient: 'bg-gradient-to-br from-danger/5 to-danger/10 border-danger/20',
        text: 'text-danger',
        iconBg: 'bg-danger/20',
    },
    warning: {
        gradient: 'bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20',
        text: 'text-warning',
        iconBg: 'bg-warning/20',
    },
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    color,
    loading,
    className,
}: StatsCardProps) {
    const colors = colorClasses[color]

    return (
        <Card className={cn(colors.gradient, className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className={cn('text-3xl font-bold mt-1', colors.text)}>
                            {loading ? '...' : value}
                        </p>
                    </div>
                    <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', colors.iconBg)}>
                        <Icon className={cn('h-6 w-6', colors.text)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

