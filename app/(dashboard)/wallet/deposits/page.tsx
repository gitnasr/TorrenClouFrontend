'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { ArrowLeft, Plus, Filter, Loader2, AlertCircle } from 'lucide-react'
import { formatNCurrency, formatDateTime } from '@/lib/utils/formatters'
import { useDeposits } from '@/hooks/usePayments'
import { DepositStatus } from '@/types/enums'
import type { DepositStatusDto } from '@/types/wallet'
import Link from 'next/link'

const depositBadgeVariants: Record<DepositStatusDto, 'default' | 'warning' | 'destructive' | 'secondary' | 'success'> = {
    'Pending': 'warning',
    'Completed': 'success',
    'Failed': 'destructive',
    'Expired': 'destructive',
}

const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: DepositStatus.Pending },
    { label: 'Completed', value: DepositStatus.Completed },
    { label: 'Failed', value: DepositStatus.Failed },
    { label: 'Expired', value: DepositStatus.Expired },
]

function DepositsSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function DepositsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Read filters from URL
    const statusFilter = searchParams.get('status') || 'all'
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 10

    // Fetch deposits from API
    const { data, isLoading, error, refetch } = useDeposits({
        pageNumber: currentPage,
        pageSize,
    })

    // Update URL with filters
    const updateFilters = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all' || (key === 'page' && value === 1)) {
                params.delete(key)
            } else {
                params.set(key, String(value))
            }
        })

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }

    // Filter deposits by status (client-side filtering)
    const deposits = data?.items || []
    const filteredDeposits = deposits.filter((dep) => {
        return statusFilter === 'all' || dep.status === statusFilter
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/wallet">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Deposit History</h1>
                        <p className="text-muted-foreground">Convert stablecoins to N coins</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/wallet/deposits/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Buy N Coins
                    </Link>
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-destructive">
                                Failed to load deposits. Please try again.
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
                    {statusFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={statusFilter === filter.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateFilters({ status: filter.value, page: 1 })}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Deposits List */}
            {isLoading ? (
                <DepositsSkeleton />
            ) : filteredDeposits.length === 0 ? (
                <EmptyState
                    icon={Filter}
                    title="No deposits found"
                    description={statusFilter !== 'all'
                        ? "Try adjusting your filters"
                        : "You haven't made any deposits yet. Buy some N coins to get started!"}
                    action={{
                        label: 'Buy N Coins',
                        onClick: () => router.push('/wallet/deposits/new')
                    }}
                />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            {filteredDeposits.map((deposit) => (
                                <Link
                                    key={deposit.id}
                                    href={`/wallet/deposits/${deposit.id}`}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div>
                                        <p className="font-medium">
                                            ${deposit.amount.toFixed(2)} {deposit.currency} → {formatNCurrency(deposit.amount)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDateTime(deposit.createdAt)}
                                        </p>
                                    </div>
                                    <Badge variant={depositBadgeVariants[deposit.status]}>
                                        {deposit.status}
                                    </Badge>
                                </Link>
                            ))}
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
                />
            )}
        </div>
    )
}

export default function DepositsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <DepositsContent />
        </Suspense>
    )
}
