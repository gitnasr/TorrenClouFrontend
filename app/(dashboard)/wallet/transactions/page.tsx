'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    Loader2
} from 'lucide-react'
import { formatNCurrency, formatDateTime } from '@/lib/utils/formatters'
import { mockTransactions, paginateData } from '@/lib/mockData'
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

function TransactionsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Read filters from URL
    const typeFilter = searchParams.get('type') || 'all'
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('size') || '10', 10)

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

    // Filter transactions
    const filteredTransactions = mockTransactions.filter((tx) => {
        return typeFilter === 'all' || tx.type === typeFilter
    })

    // Paginate
    const paginatedResult = paginateData(filteredTransactions, currentPage, pageSize)

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
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Filter}
                    title="No transactions found"
                    description="Try adjusting your filters or check back later"
                />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            {paginatedResult.items.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            {transactionIcons[tx.type]}
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            <Pagination
                totalItems={paginatedResult.totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={(page) => updateFilters({ page })}
                onPageSizeChange={(size) => updateFilters({ size, page: 1 })}
            />
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

