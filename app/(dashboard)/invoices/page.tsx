'use client'

import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import {
    FileText,
    Eye,
    Calendar,

    CheckCircle,

    Clock,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import Link from 'next/link'
import { useInvoices, useInvoiceStatistics } from '@/hooks/useInvoices'
import { useInvoicesStore } from '@/stores/invoicesStore'
import type { Invoice } from '@/types/invoices'

// Helper to get status badge variant and label
function getInvoiceStatus(invoice: Invoice): { variant: 'success' | 'destructive' | 'secondary' | 'warning'; label: string } {
    if (invoice.isRefunded) {
        return { variant: 'secondary', label: 'Refunded' }
    }
    if (invoice.isCancelled) {
        return { variant: 'destructive', label: 'Cancelled' }
    }
    if (invoice.isPaid) {
        return { variant: 'success', label: 'Paid' }
    }
    if (invoice.isExpired) {
        return { variant: 'warning', label: 'Expired' }
    }
    return { variant: 'secondary', label: 'Pending' }
}

function InvoicesContent() {
    const { currentPage, pageSize, setCurrentPage, setPageSize } = useInvoicesStore()
    const { data, isLoading, error, refetch } = useInvoices()
    const { data: stats, isLoading: statsLoading } = useInvoiceStatistics()

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle page size change
    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                        <p className="text-muted-foreground mt-1">
                            View your billing history and download receipts
                        </p>
                    </div>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load invoices</h3>
                        <p className="text-muted-foreground mb-4">
                            {error.message || 'An unexpected error occurred'}
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const invoices = data?.items ?? []

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground mt-1">
                        View your billing history and download receipts
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                                <p className="text-3xl font-bold mt-1 text-primary">
                                    {statsLoading ? '...' : stats?.totalInvoices ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                                <p className="text-3xl font-bold mt-1 text-success">
                                    {statsLoading ? '...' : stats?.paidInvoices ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Unpaid</p>
                                <p className="text-3xl font-bold mt-1 text-warning">
                                    {statsLoading ? '...' : stats?.unpaidInvoices ?? 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-warning" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            {invoices.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No invoices yet"
                    description="Your billing history will appear here"
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {invoices.map((invoice) => {
                                const status = getInvoiceStatus(invoice)
                                return (
                                    <Link
                                        key={invoice.id}
                                        href={`/invoices/${invoice.id}`}
                                        className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {invoice.torrentFileName || `Invoice #${invoice.id}`}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDateTime(invoice.createdAt)}
                                                    </span>
                                                    <span>{invoice.jobId ? `Job #${invoice.jobId}` : 'Manual'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="font-semibold text-lg">
                                                    {formatCurrency(invoice.finalAmountInUSD)}
                                                </span>
                                                {invoice.originalAmountInUSD !== invoice.finalAmountInUSD && (
                                                    <p className="text-xs text-muted-foreground line-through">
                                                        {formatCurrency(invoice.originalAmountInUSD)}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant={status.variant}>{status.label}</Badge>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {data && data.totalCount > 0 && (
                <Pagination
                    totalItems={data.totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    )
}

export default function InvoicesPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <InvoicesContent />
        </Suspense>
    )
}
