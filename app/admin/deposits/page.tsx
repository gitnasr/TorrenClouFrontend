'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import {
    Receipt,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign
} from 'lucide-react'
import { mockAdminDeposits, paginateData } from '@/lib/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import { DepositStatus } from '@/types/enums'
import { toast } from 'sonner'

const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: DepositStatus.Pending },
    { label: 'Completed', value: DepositStatus.Completed },
    { label: 'Failed', value: DepositStatus.Failed },
]

const depositBadgeVariants: Record<DepositStatus, 'default' | 'warning' | 'destructive' | 'secondary'> = {
    [DepositStatus.Pending]: 'warning',
    [DepositStatus.Completed]: 'default',
    [DepositStatus.Failed]: 'destructive',
    [DepositStatus.Expired]: 'destructive',
}

export default function AdminDepositsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const filteredDeposits = mockAdminDeposits.filter((dep) => {
        return statusFilter === 'all' || dep.status === statusFilter
    })

    const paginatedResult = paginateData(filteredDeposits, currentPage, pageSize)

    const handleApprove = (id: number) => {
        toast.success(`Deposit #${id} approved`)
    }

    const handleReject = (id: number) => {
        toast.error(`Deposit #${id} rejected`)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Deposits</h1>
                <p className="text-muted-foreground mt-1">
                    Manage user deposit requests
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-2 flex-wrap">
                        {statusFilters.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={statusFilter === filter.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    setStatusFilter(filter.value)
                                    setCurrentPage(1)
                                }}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Deposits List */}
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="No deposits found"
                    description="Try adjusting your filters"
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {paginatedResult.items.map((deposit) => (
                                <div
                                    key={deposit.id}
                                    className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-lime/10 flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-lime" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                {formatCurrency(deposit.amount)} {deposit.currency}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                <span>User #{deposit.userId}</span>
                                                <span>{formatDateTime(deposit.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={depositBadgeVariants[deposit.status]}>
                                            {deposit.status}
                                        </Badge>
                                        {deposit.status === DepositStatus.Pending && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-mint hover:bg-mint/10"
                                                    onClick={() => handleApprove(deposit.id)}
                                                >
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-plum hover:bg-plum/10"
                                                    onClick={() => handleReject(deposit.id)}
                                                >
                                                    <XCircle className="mr-1 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
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
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

