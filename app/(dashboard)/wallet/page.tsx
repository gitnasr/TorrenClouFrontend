'use client'

import { BalanceCard } from '@/components/wallet/balance-card'
import { TransactionList } from '@/components/wallet/transaction-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import { mockWalletBalance, mockTransactions, mockDeposits } from '@/lib/mockData'
import { DepositStatus } from '@/types/enums'
import Link from 'next/link'

const depositBadgeVariants: Record<DepositStatus, 'default' | 'warning' | 'destructive' | 'secondary'> = {
    [DepositStatus.Pending]: 'warning',
    [DepositStatus.Completed]: 'default',
    [DepositStatus.Failed]: 'destructive',
    [DepositStatus.Expired]: 'destructive',
}

export default function WalletPage() {
    const recentDeposits = mockDeposits.slice(0, 3)

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

            {/* Balance and Stats */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BalanceCard
                        balance={mockWalletBalance.balance}
                        changeAmount={25.50}
                        changePercentage={19.5}
                        showActions={false}
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-primary/10">
                                <ArrowDownLeft className="h-6 w-6 text-teal-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Deposits</p>
                                <p className="text-xl font-bold">{formatCurrency(350)}</p>
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
                                <p className="text-xl font-bold">{formatCurrency(193.22)}</p>
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
                <TransactionList
                    transactions={mockTransactions}
                    limit={5}
                />

                {/* Recent Deposits */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">Recent Deposits</CardTitle>
                        <Link href="/wallet/deposits" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentDeposits.length === 0 ? (
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
            </div>
        </div>
    )
}

