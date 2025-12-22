'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    CheckCircle,
    Zap,
} from 'lucide-react'
import { formatCurrency, formatDateTime, formatRelativeTime, formatFileSize, getTimeRemaining } from '@/lib/utils/formatters'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useInvoice } from '@/hooks/useInvoices'
import { useWalletBalance, useInvoicePayment } from '@/hooks/usePayments'
import { useTorrentStore } from '@/stores/torrentStore'
import type { Invoice } from '@/types/invoices'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal'

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

// Pending Invoice View (Quote-style)
function PendingInvoiceView({ invoice }: { invoice: Invoice }) {
    const router = useRouter()
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showInsufficientModal, setShowInsufficientModal] = useState(false)

    // Get quote data from store if available (just came from analyze page)
    const quoteResult = useTorrentStore((state) => state.quoteResult)
    const pricingDetails = quoteResult?.pricingDetails

    // API hooks
    const { data: walletData, isLoading: isLoadingBalance } = useWalletBalance()
    const { mutate: payInvoice, isPending: isPaying } = useInvoicePayment()

    const balance = walletData?.balance ?? 0
    const finalAmount = invoice.finalAmountInUSD
    const hasInsufficientBalance = balance < finalAmount

    const expiryInfo = getTimeRemaining(invoice.expiresAt)

    const handlePay = () => {
        if (hasInsufficientBalance) {
            setShowInsufficientModal(true)
            return
        }
        setShowPaymentModal(true)
    }

    const confirmPayment = () => {
        payInvoice(invoice.id)
        setShowPaymentModal(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/torrents/analyze">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Quote & Payment</h1>
                    <p className="text-muted-foreground">Review your quote and complete payment</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Torrent Summary */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {invoice.torrentFileName || `Invoice #${invoice.id}`}
                                </CardTitle>
                                {quoteResult?.isCached && (
                                    <Badge variant="warning" className="flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        Cached
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {quoteResult?.isCached && (
                                    <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
                                        <Zap className="h-5 w-5 text-warning" />
                                        <div>
                                            <p className="text-sm font-medium">Cached</p>
                                            <p className="text-xs text-muted-foreground">Instant download available</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Quote expires in</p>
                                        <p className={cn(
                                            "text-xs",
                                            expiryInfo.isExpired ? "text-destructive" : "text-muted-foreground"
                                        )}>
                                            {expiryInfo.formatted}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pricingDetails ? (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Size ({pricingDetails.calculatedSizeInGb.toFixed(2)} GB × ${pricingDetails.baseRatePerGb}/GB)
                                        </span>
                                        <span>{formatCurrency(pricingDetails.calculatedSizeInGb * pricingDetails.baseRatePerGb, 'USD')}</span>
                                    </div>
                                    {pricingDetails.regionMultiplier !== 1 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Region adjustment ({pricingDetails.userRegion})</span>
                                            <span>×{pricingDetails.regionMultiplier}</span>
                                        </div>
                                    )}
                                    {pricingDetails.healthMultiplier !== 1 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Health adjustment</span>
                                            <span className="text-teal-secondary">×{pricingDetails.healthMultiplier}</span>
                                        </div>
                                    )}
                                    {pricingDetails.isCacheHit && pricingDetails.cacheDiscountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Zap className="h-3.5 w-3.5 text-warning" />
                                                Cache discount
                                            </span>
                                            <span className="text-teal-secondary">-{formatCurrency(pricingDetails.cacheDiscountAmount, 'USD')}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Original Amount</span>
                                        <span>{formatCurrency(invoice.originalAmountInUSD, 'USD')}</span>
                                    </div>
                                    {invoice.originalAmountInUSD !== invoice.finalAmountInUSD && (
                                        <div className="flex justify-between text-sm text-teal-secondary">
                                            <span>Discount Applied</span>
                                            <span>-{formatCurrency(invoice.originalAmountInUSD - invoice.finalAmountInUSD, 'USD')}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(invoice.finalAmountInUSD, 'USD')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Payment */}
                <div className="space-y-4">
                    <Card className={cn(hasInsufficientBalance && 'border-sage/50')}>
                        <CardHeader>
                            <CardTitle className="text-base">Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Your balance</span>
                                <span className="font-medium">
                                    {isLoadingBalance ? '...' : formatCurrency(balance, 'USD')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Invoice amount</span>
                                <span className="font-medium">{formatCurrency(finalAmount, 'USD')}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                                <span className="text-muted-foreground">Balance after</span>
                                <span className={cn(
                                    'font-medium',
                                    hasInsufficientBalance ? 'text-sage' : 'text-teal-secondary'
                                )}>
                                    {formatCurrency(balance - finalAmount, 'USD')}
                                </span>
                            </div>

                            {hasInsufficientBalance && (
                                <div className="flex items-start gap-2 rounded-lg bg-sage/10 p-3 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-sage mt-0.5" />
                                    <p className="text-sage">
                                        Insufficient balance. You need {formatCurrency(finalAmount - balance, 'USD')} more.
                                    </p>
                                </div>
                            )}

                            {expiryInfo.isExpired ? (
                                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                                    <p className="text-destructive">
                                        This quote has expired. Please get a new quote.
                                    </p>
                                </div>
                            ) : (
                                <Button onClick={handlePay} className="w-full" size="lg" disabled={expiryInfo.isExpired}>
                                    {hasInsufficientBalance ? 'Add Funds to Pay' : `Pay ${formatCurrency(finalAmount, 'USD')}`}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            <Modal open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Confirm Payment</ModalTitle>
                        <ModalDescription>
                            You are about to pay {formatCurrency(finalAmount, 'USD')} for this download.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-between text-sm">
                            <span>File</span>
                            <span className="font-medium">{invoice.torrentFileName || `Invoice #${invoice.id}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Amount</span>
                            <span className="font-medium">{formatCurrency(finalAmount, 'USD')}</span>
                        </div>
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmPayment} disabled={isPaying}>
                            {isPaying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Payment'
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Insufficient Balance Modal */}
            <Modal open={showInsufficientModal} onOpenChange={setShowInsufficientModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Insufficient Balance</ModalTitle>
                        <ModalDescription>
                            You need {formatCurrency(finalAmount - balance, 'USD')} more to complete this payment.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowInsufficientModal(false)}>
                            Cancel
                        </Button>
                        <Button asChild>
                            <Link href="/wallet/deposits/new">Add Funds</Link>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

// Paid Invoice View (Default)
function PaidInvoiceView({ invoice }: { invoice: Invoice }) {
    const status = getInvoiceStatus(invoice)
    const hasDiscount = invoice.originalAmountInUSD !== invoice.finalAmountInUSD

    const handleDownload = () => {
        toast.success('Invoice downloaded')
    }

    const handlePrint = () => {
        window.print()
    }

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

export default function InvoiceDetailPage() {
    const params = useParams()
    const invoiceId = Number(params.id)

    const { data: invoice, isLoading, error, refetch } = useInvoice(invoiceId)

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

    // Determine which view to show based on invoice status
    const isPending = !invoice.isPaid && !invoice.isCancelled && !invoice.isRefunded

    if (isPending) {
        return <PendingInvoiceView invoice={invoice} />
    }

    return <PaidInvoiceView invoice={invoice} />
}
