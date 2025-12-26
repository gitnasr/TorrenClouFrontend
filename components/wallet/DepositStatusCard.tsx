'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DepositDto } from '@/types/wallet'
import { getDepositStatusConfig } from './DepositStatusConfig'

interface DepositStatusCardProps {
    deposit: DepositDto
}

export function DepositStatusCard({ deposit }: DepositStatusCardProps) {
    const config = getDepositStatusConfig(deposit.status)
    const isPending = deposit.status === 'Pending'
    const isFailed = deposit.status === 'Failed' || deposit.status === 'Expired'

    return (
        <Card className={cn(
            isPending && 'border-warning/50 bg-warning/5',
            deposit.status === 'Completed' && 'border-teal-secondary/50 bg-teal-secondary/5',
            isFailed && 'border-orange/50 bg-orange/5'
        )}>
            <CardContent className="flex items-center gap-4 pt-6">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', config.color)}>
                    {config.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{deposit.status}</h2>
                        <Badge variant={config.badgeVariant}>{deposit.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

