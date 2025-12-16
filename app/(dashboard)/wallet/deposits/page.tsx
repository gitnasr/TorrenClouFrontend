'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { ArrowLeft, Plus, Filter, Loader2 } from 'lucide-react'
import { formatNCurrency, formatDateTime } from '@/lib/utils/formatters'
import { mockDeposits, paginateData } from '@/lib/mockData'
import { DepositStatus } from '@/types/enums'
import Link from 'next/link'

const depositBadgeVariants: Record<DepositStatus, 'default' | 'warning' | 'destructive' | 'secondary' | 'success'> = {
    [DepositStatus.Pending]: 'warning',
    [DepositStatus.Completed]: 'success',
    [DepositStatus.Failed]: 'destructive',
    [DepositStatus.Expired]: 'destructive',
}

const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: DepositStatus.Pending },
    { label: 'Completed', value: DepositStatus.Completed },
    { label: 'Failed', value: DepositStatus.Failed },
    { label: 'Expired', value: DepositStatus.Expired },
]

function DepositsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Read filters from URL
    const statusFilter = searchParams.get('status') || 'all'
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 10

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

    // Filter deposits
    const filteredDeposits = mockDeposits.filter((dep) => {
        return statusFilter === 'all' || dep.status === statusFilter
    })

    // Paginate
    const paginatedResult = paginateData(filteredDeposits, currentPage, pageSize)

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
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Filter}
                    title="No deposits found"
                    description="Try adjusting your filters or buy some N coins"
                    action={{
                        label: 'Buy N Coins',
                        onClick: () => router.push('/wallet/deposits/new')
                    }}
                />
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            {paginatedResult.items.map((deposit) => (
                                <Link
                                    key={deposit.id}
                                    href={`/wallet/deposits/${deposit.id}`}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {deposit.amount} {deposit.currency} → {formatNCurrency(deposit.amount)}
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
            <Pagination
                totalItems={paginatedResult.totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={(page) => updateFilters({ page })}
            />
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

