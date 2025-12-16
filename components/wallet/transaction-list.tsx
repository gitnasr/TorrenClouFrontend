'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import { TransactionType } from '@/types/enums'
import type { WalletTransaction } from '@/types/api'
import { ArrowDownLeft, ArrowUpRight, RefreshCcw, Gift, Minus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { TransactionListProps } from '@/types/wallet'


const transactionIcons: Record<TransactionType, React.ReactNode> = {
    [TransactionType.DEPOSIT]: <ArrowDownLeft className="h-4 w-4 text-teal-primary" />,
    [TransactionType.PAYMENT]: <ArrowUpRight className="h-4 w-4 text-sage" />,
    [TransactionType.REFUND]: <RefreshCcw className="h-4 w-4 text-teal-secondary" />,
    [TransactionType.ADMIN_ADJUSTMENT]: <Settings className="h-4 w-4 text-warning" />,
    [TransactionType.BONUS]: <Gift className="h-4 w-4 text-warning" />,
    [TransactionType.DEDUCTION]: <Minus className="h-4 w-4 text-sage" />,
}

const transactionBadgeVariants: Record<TransactionType, 'default' | 'secondary' | 'destructive' | 'warning'> = {
    [TransactionType.DEPOSIT]: 'default',
    [TransactionType.PAYMENT]: 'destructive',
    [TransactionType.REFUND]: 'secondary',
    [TransactionType.ADMIN_ADJUSTMENT]: 'warning',
    [TransactionType.BONUS]: 'warning',
    [TransactionType.DEDUCTION]: 'destructive',
}

export function TransactionList({
    transactions,
    limit,
    showViewAll = true,
    className,
}: TransactionListProps) {
    const displayedTransactions = limit ? transactions.slice(0, limit) : transactions

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
                {showViewAll && (
                    <Link href="/wallet/transactions" className="text-sm text-primary hover:underline">
                        View All
                    </Link>
                )}
            </CardHeader>
            <CardContent>
                {displayedTransactions.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No transactions yet
                    </p>
                ) : (
                    <div className="space-y-3">
                        {displayedTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                        {transactionIcons[transaction.type]}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium line-clamp-1">
                                            {transaction.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatRelativeTime(transaction.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'font-medium',
                                            transaction.amount >= 0 ? 'text-teal-secondary' : 'text-sage'
                                        )}
                                    >
                                        {transaction.amount >= 0 ? '+' : ''}
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

