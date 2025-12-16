'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import {
    FileText,
    Download,
    Eye,
    Calendar,
    DollarSign
} from 'lucide-react'
import { mockInvoices, paginateData } from '@/lib/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import Link from 'next/link'

export default function InvoicesPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const paginatedResult = paginateData(mockInvoices, currentPage, pageSize)

    // Stats
    const totalSpent = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0)

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
                <Card className="bg-gradient-to-br from-muted/50 to-muted">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                                <p className="text-3xl font-bold mt-1">{mockInvoices.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                <p className="text-3xl font-bold mt-1 text-mint">{formatCurrency(totalSpent)}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-mint/10 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-mint" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No invoices yet"
                    description="Your billing history will appear here"
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {paginatedResult.items.map((invoice) => (
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
                                            <h3 className="font-semibold">Invoice #{invoice.id}</h3>
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
                                        <span className="font-semibold text-lg">{formatCurrency(invoice.amount)}</span>
                                        <Badge variant="success">Paid</Badge>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
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
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

