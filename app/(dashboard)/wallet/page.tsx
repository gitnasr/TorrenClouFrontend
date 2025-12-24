'use client'

import { BalanceCard } from '@/components/wallet/balance-card'
import { TransactionList } from '@/components/wallet/transaction-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Receipt, ArrowDownLeft, ArrowUpRight, AlertCircle } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import { TransactionType } from '@/types/enums'
import { useWalletBalance, useWalletTransactions } from '@/hooks/useWallet'
import { useDeposits } from '@/hooks/usePayments'
import type { WalletTransaction } from '@/types/api'
import type { DepositStatusDto } from '@/types/wallet'
import Link from 'next/link'

const depositBadgeVariants: Record<DepositStatusDto, 'default' | 'warning' | 'destructive' | 'secondary' | 'success'> = {
    'Pending': 'warning',
    'Completed': 'success',
    'Failed': 'destructive',
    'Expired': 'destructive',
}

// Helper to convert API transaction type string to enum
function mapTransactionType(type: string): TransactionType {
    const typeMap: Record<string, TransactionType> = {
        'DEPOSIT': TransactionType.DEPOSIT,
        'PAYMENT': TransactionType.PAYMENT,
        'REFUND': TransactionType.REFUND,
        'ADMIN_ADJUSTMENT': TransactionType.ADMIN_ADJUSTMENT,
        'BONUS': TransactionType.BONUS,
        'DEDUCTION': TransactionType.DEDUCTION,
    }
    return typeMap[type] || TransactionType.PAYMENT
}

// Transform API transactions to component format
function transformTransactions(transactions: {
    id: number
    amount: number
    type: string
    referenceId?: string | null
    description: string
    createdAt: string
}[]): WalletTransaction[] {
    return transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: mapTransactionType(t.type),
        referenceId: t.referenceId ?? undefined,
        description: t.description,
        createdAt: t.createdAt,
    }))
}

function BalanceCardSkeleton() {
    return (
        <Card className="bg-gradient-to-br from-primary/20 to-surface-tonal border-primary/30">
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardContent>
        </Card>
    )
}

function TransactionsSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function DepositsSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function WalletPage() {
    const { data: balanceData, isLoading: isLoadingBalance, error: balanceError } = useWalletBalance()
    const { data: transactionsData, isLoading: isLoadingTransactions, error: transactionsError } = useWalletTransactions({ pageSize: 5 })
    const { data: depositsData, isLoading: isLoadingDeposits, error: depositsError } = useDeposits({ pageSize: 3 })

    // Get recent deposits from API
    const recentDeposits = depositsData?.items || []

    // Calculate total deposits and spent from transactions
    const transactions = transactionsData?.items || []
    const totalDeposits = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
    const totalSpent = Math.abs(
        transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0)
    )

    const transformedTransactions = transformTransactions(transactions)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Wallet</h1>
                    <p className="text-muted-foreground">
                        Manage your balance and transactions
                    </p>
                </div>
                <Button asChild>
                    <Link href="/wallet/deposits/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Funds
                    </Link>
                </Button>
            </div>

            {/* Error State */}
            {(balanceError || transactionsError) && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <p className="text-destructive">
                            Failed to load wallet data. Please try again.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Balance and Stats */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {isLoadingBalance ? (
                        <BalanceCardSkeleton />
                    ) : (
                        <BalanceCard
                            balance={balanceData?.balance ?? 0}
                            showActions={false}
                        />
                    )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-primary/10">
                                <ArrowDownLeft className="h-6 w-6 text-teal-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Deposits</p>
                                {isLoadingTransactions ? (
                                    <Skeleton className="h-7 w-20" />
                                ) : (
                                    <p className="text-xl font-bold">{formatCurrency(totalDeposits)}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sage/10">
                                <ArrowUpRight className="h-6 w-6 text-sage" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                {isLoadingTransactions ? (
                                    <Skeleton className="h-7 w-20" />
                                ) : (
                                    <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Button asChild size="lg" className="h-auto py-4">
                    <Link href="/wallet/deposits/new">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Funds
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-auto py-4">
                    <Link href="/wallet/transactions">
                        <Receipt className="mr-2 h-5 w-5" />
                        View Transactions
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-auto py-4">
                    <Link href="/wallet/deposits">
                        <ArrowDownLeft className="mr-2 h-5 w-5" />
                        Deposit History
                    </Link>
                </Button>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Transactions */}
                {isLoadingTransactions ? (
                    <TransactionsSkeleton />
                ) : (
                    <TransactionList
                        transactions={transformedTransactions}
                        limit={5}
                    />
                )}

                {/* Recent Deposits */}
                {isLoadingDeposits ? (
                    <DepositsSkeleton />
                ) : (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium">Recent Deposits</CardTitle>
                            <Link href="/wallet/deposits" className="text-sm text-primary hover:underline">
                                View All
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {depositsError ? (
                                <p className="py-4 text-center text-sm text-destructive">
                                    Failed to load deposits
                                </p>
                            ) : recentDeposits.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No deposits yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentDeposits.map((deposit) => (
                                        <Link
                                            key={deposit.id}
                                            href={`/wallet/deposits/${deposit.id}`}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium">
                                                    {formatCurrency(deposit.amount)} {deposit.currency}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatRelativeTime(deposit.createdAt)}
                                                </p>
                                            </div>
                                            <Badge variant={depositBadgeVariants[deposit.status]}>
                                                {deposit.status}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
