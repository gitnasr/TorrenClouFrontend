'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    FileText,
    Download,
    Printer,
    Calendar,
    DollarSign,
    HardDrive,
    Loader2,
    AlertCircle,
    RefreshCw,
    Clock,
    XCircle,
    CheckCircle
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils/formatters'
import Link from 'next/link'
import { toast } from 'sonner'
import { useInvoice } from '@/hooks/useInvoices'
import type { Invoice } from '@/types/invoices'

// Helper to get status badge variant and label
function getInvoiceStatus(invoice: Invoice): { variant: 'success' | 'destructive' | 'secondary' | 'warning'; label: string; icon: React.ReactNode } {
    if (invoice.isRefunded) {
        return { variant: 'secondary', label: 'Refunded', icon: <XCircle className="h-4 w-4" /> }
    }
    if (invoice.isCancelled) {
        return { variant: 'destructive', label: 'Cancelled', icon: <XCircle className="h-4 w-4" /> }
    }
    if (invoice.isPaid) {
        return { variant: 'success', label: 'Paid', icon: <CheckCircle className="h-4 w-4" /> }
    }
    if (invoice.isExpired) {
        return { variant: 'warning', label: 'Expired', icon: <Clock className="h-4 w-4" /> }
    }
    return { variant: 'secondary', label: 'Pending', icon: <Clock className="h-4 w-4" /> }
}

export default function InvoiceDetailPage() {
    const params = useParams()
    const invoiceId = Number(params.id)

    const { data: invoice, isLoading, error, refetch } = useInvoice(invoiceId)

    const handleDownload = () => {
        toast.success('Invoice downloaded')
    }

    const handlePrint = () => {
        window.print()
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
    if (error || !invoice) {
        return (
            <div className="space-y-8 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load invoice</h3>
                        <p className="text-muted-foreground mb-4">
                            {error?.message || 'Invoice not found'}
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

    const status = getInvoiceStatus(invoice)
    const hasDiscount = invoice.originalAmountInUSD !== invoice.finalAmountInUSD

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Invoice #{invoice.id}</h1>
                        <p className="text-muted-foreground">{formatDateTime(invoice.createdAt)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Card */}
            <Card className="print:shadow-none">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b pb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">TorreClou</h2>
                                <p className="text-sm text-muted-foreground">Invoice #{invoice.id}</p>
                            </div>
                        </div>
                        <Badge variant={status.variant} className="text-sm">
                            {status.label}
                        </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid gap-6 py-6 sm:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Invoice Date
                                </p>
                                <p className="font-medium mt-1">{formatDateTime(invoice.createdAt)}</p>
                            </div>
                            {invoice.paidAt && (
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Paid On
                                    </p>
                                    <p className="font-medium mt-1">{formatDateTime(invoice.paidAt)}</p>
                                </div>
                            )}
                            {invoice.jobId && (
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <HardDrive className="h-4 w-4" />
                                        Related Job
                                    </p>
                                    <Link
                                        href={`/torrents/jobs/${invoice.jobId}`}
                                        className="font-medium mt-1 text-primary hover:underline"
                                    >
                                        Job #{invoice.jobId}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            {invoice.torrentFileName && (
                                <div>
                                    <p className="text-sm text-muted-foreground">File Name</p>
                                    <p className="font-medium mt-1 truncate" title={invoice.torrentFileName}>
                                        {invoice.torrentFileName}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Expires</p>
                                <p className="font-medium mt-1">
                                    {formatDateTime(invoice.expiresAt)}
                                    <span className="text-muted-foreground text-sm ml-2">
                                        ({formatRelativeTime(invoice.expiresAt)})
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border-t py-6">
                        <h3 className="font-semibold mb-4">Billing Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Original Amount (USD)</span>
                                <span>{formatCurrency(invoice.originalAmountInUSD)}</span>
                            </div>
                            {hasDiscount && (
                                <div className="flex justify-between text-sm text-success">
                                    <span>Discount Applied</span>
                                    <span>-{formatCurrency(invoice.originalAmountInUSD - invoice.finalAmountInUSD)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Final Amount (USD)</span>
                                <span className="font-medium">{formatCurrency(invoice.finalAmountInUSD)}</span>
                            </div>
                            {invoice.finalAmountInNCurrency > 0 && (
                                <div className="flex justify-between text-sm border-t pt-3">
                                    <span className="text-muted-foreground">
                                        Local Currency (Rate: {invoice.exchangeRate})
                                    </span>
                                    <span className="font-medium">
                                        {invoice.finalAmountInNCurrency.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg font-semibold">Total Amount</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(invoice.finalAmountInUSD)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-medium">Wallet Balance</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className={`font-medium ${invoice.isPaid ? 'text-success' : 'text-warning'}`}>
                            {invoice.isPaid ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                    {invoice.paidAt && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Paid At</span>
                            <span className="font-medium">{formatDateTime(invoice.paidAt)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
