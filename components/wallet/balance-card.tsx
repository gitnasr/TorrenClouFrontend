'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { formatNCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { BalanceCardProps } from '@/types/wallet'


export function BalanceCard({
    balance,
    changeAmount,
    changePercentage,
    showActions = true,
    className,
}: BalanceCardProps) {
    const isPositiveChange = (changeAmount ?? 0) >= 0

    return (
        <Card className={cn('bg-gradient-to-br from-primary/20 to-surface-tonal border-primary/30', className)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    N Coin Balance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <p className="text-4xl font-bold text-primary">
                        {formatNCurrency(balance)}
                    </p>
                    {changeAmount !== undefined && (
                        <div className="flex items-center gap-1 text-sm mt-2">
                            {isPositiveChange ? (
                                <TrendingUp className="h-4 w-4 text-success" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-danger" />
                            )}
                            <span className={isPositiveChange ? 'text-success' : 'text-danger'}>
                                {isPositiveChange ? '+' : ''}{formatNCurrency(changeAmount)}
                            </span>
                            {changePercentage !== undefined && (
                                <span className="text-muted-foreground">
                                    ({isPositiveChange ? '+' : ''}{changePercentage.toFixed(1)}%)
                                </span>
                            )}
                            <span className="text-muted-foreground">this week</span>
                        </div>
                    )}
                </div>

                {showActions && (
                    <div className="flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href="/wallet/deposits/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Buy N Coins
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/wallet">View Wallet</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
