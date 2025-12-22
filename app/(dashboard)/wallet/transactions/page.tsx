'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import {
    ArrowDownLeft,
    ArrowUpRight,
    RefreshCcw,
    Gift,
    Minus,
    Settings,
    Filter,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { formatNCurrency, formatDateTime } from '@/lib/utils/formatters'
import { useWalletTransactions } from '@/hooks/useWallet'
import { TransactionType } from '@/types/enums'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const transactionIcons: Record<TransactionType, React.ReactNode> = {
    [TransactionType.DEPOSIT]: <ArrowDownLeft className="h-4 w-4 text-mint" />,
    [TransactionType.PAYMENT]: <ArrowUpRight className="h-4 w-4 text-sage" />,
    [TransactionType.REFUND]: <RefreshCcw className="h-4 w-4 text-mint" />,
    [TransactionType.ADMIN_ADJUSTMENT]: <Settings className="h-4 w-4 text-lime" />,
    [TransactionType.BONUS]: <Gift className="h-4 w-4 text-lime" />,
    [TransactionType.DEDUCTION]: <Minus className="h-4 w-4 text-plum" />,
}

const typeFilters = [
    { label: 'All', value: 'all' },
    { label: 'Deposits', value: TransactionType.DEPOSIT },
    { label: 'Payments', value: TransactionType.PAYMENT },
    { label: 'Refunds', value: TransactionType.REFUND },
    { label: 'Adjustments', value: TransactionType.ADMIN_ADJUSTMENT },
]

// Helper to map string type to enum
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

function TransactionsSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function TransactionsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Read filters from URL
    const typeFilter = searchParams.get('type') || 'all'
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('size') || '10', 10)

    // Fetch transactions from API
    const { data, isLoading, error, refetch } = useWalletTransactions({
        pageNumber: currentPage,
        pageSize,
    })

    // Update URL with filters
    const updateFilters = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all' || (key === 'page' && value === 1) || (key === 'size' && value === 10)) {
                params.delete(key)
            } else {
                params.set(key, String(value))
            }
        })

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }

    // Filter transactions by type (client-side for now, can be moved to server)
    const transactions = data?.items || []
    const filteredTransactions = transactions.filter((tx) => {
        return typeFilter === 'all' || tx.type === typeFilter
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/wallet">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                    <p className="text-muted-foreground">View all your N coin transactions</p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-destructive">
                                Failed to load transactions. Please try again.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="flex flex-wrap gap-2 pt-6">
                    {typeFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={typeFilter === filter.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateFilters({ type: filter.value, page: 1 })}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Transactions List */}
            {isLoading ? (
                <TransactionsSkeleton />
            ) : filteredTransactions.length === 0 ? (
                <EmptyState
                    icon={Filter}
                    title="No transactions found"
                    description={typeFilter !== 'all'
                        ? "Try adjusting your filters"
                        : "You don't have any transactions yet"}
                />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            {filteredTransactions.map((tx) => {
                                const txType = mapTransactionType(tx.type)
                                return (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                {transactionIcons[txType]}
                                            </div>
                                            <div>
                                                <p className="font-medium line-clamp-1">{tx.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDateTime(tx.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={cn(
                                                    'font-medium',
                                                    tx.amount >= 0 ? 'text-mint' : 'text-plum'
                                                )}
                                            >
                                                {tx.amount >= 0 ? '+' : ''}
                                                {formatNCurrency(tx.amount)}
                                            </p>
                                            <Badge variant="outline" className="text-xs">
                                                {tx.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {data && (
                <Pagination
                    totalItems={data.totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={(page) => updateFilters({ page })}
                    onPageSizeChange={(size) => updateFilters({ size, page: 1 })}
                />
            )}
        </div>
    )
}

export default function TransactionsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <TransactionsContent />
        </Suspense>
    )
}
