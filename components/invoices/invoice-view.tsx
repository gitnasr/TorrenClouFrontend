'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Download,
    Printer,
    Loader2,
} from 'lucide-react'
import { formatDateTime, formatNCurrency } from '@/lib/utils/formatters'
import Link from 'next/link'
import { toast } from 'sonner'
import { useInvoicePayment } from '@/hooks/usePayments'
import type { Invoice } from '@/types/invoices'
import type { PricingSnapshot } from '@/types/torrents'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal'
import { useWalletBalance } from '@/hooks/useWallet'
import { PricingBreakdown } from './pricing-breakdown'
import { InvoiceSummaryCard } from './invoice-summary-card'
import { PaymentCard } from './payment-card'
import { PaymentInfoCard } from './payment-info-card'
import { XCircle, CheckCircle, Clock } from 'lucide-react'

interface InvoiceViewProps {
    invoice: Invoice
}

// Helper to get status badge variant and label
function getInvoiceStatus(invoice: Invoice): { 
    variant: 'success' | 'destructive' | 'secondary' | 'warning'
    label: string
    icon: React.ReactNode 
} {
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

export function InvoiceView({ invoice }: InvoiceViewProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showInsufficientModal, setShowInsufficientModal] = useState(false)

    // Determine if this is a pending invoice
    const isPending = !invoice.isPaid && !invoice.isCancelled && !invoice.isRefunded && !invoice.isExpired
    const status = getInvoiceStatus(invoice)

    // Get pricing details from invoice (use pricingDetails if available, fallback to pricingSnapshot for backward compatibility)
    const pricingDetails = invoice.pricingDetails || invoice.pricingSnapshot
    const pricingSnapshot = pricingDetails // Keep for backward compatibility with existing code

    // API hooks (only needed for pending invoices)
    const { data: walletData, isLoading: isLoadingBalance } = useWalletBalance()
    const { mutate: payInvoice, isPending: isPaying } = useInvoicePayment()

    const balance = walletData?.balance ?? 0
    const finalAmount = invoice.finalAmountInUSD
    const hasInsufficientBalance = balance < finalAmount

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

    const handleDownload = () => {
        toast.success('Invoice downloaded')
    }

    const handlePrint = () => {
        window.print()
    }

    // Determine back link based on status
    const backLink = isPending ? '/torrents/analyze' : '/invoices'
    const backLabel = isPending ? 'Back' : 'Back to Invoices'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={backLink}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {backLabel}
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                {isPending ? 'Quote & Payment' : `Invoice #${invoice.id}`}
                            </h1>
                            <Badge variant={status.variant} className="flex items-center gap-1">
                                {status.icon}
                                {status.label}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            {isPending ? 'Review your quote and complete payment' : formatDateTime(invoice.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Print/Download actions for paid invoices */}
                {!isPending && (
                    <div className="flex gap-2 print:hidden">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Torrent/Invoice Summary */}
                    <InvoiceSummaryCard 
                        invoice={invoice}
                        isPending={isPending}
                        pricingDetails={pricingSnapshot ?? null}
                    />

                    {/* Pricing Breakdown */}
                    <PricingBreakdown 
                        invoice={invoice} 
                        pricingSnapshot={pricingSnapshot ?? null}
                        showExchangeRate={!isPending}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {isPending ? (
                        <PaymentCard
                            invoice={invoice}
                            balance={balance}
                            isLoadingBalance={isLoadingBalance}
                            onPay={handlePay}
                        />
                    ) : (
                        <PaymentInfoCard invoice={invoice} />
                    )}
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            <Modal open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Confirm Payment</ModalTitle>
                        <ModalDescription>
                            You are about to pay {formatNCurrency(finalAmount)} for this download.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-between text-sm">
                            <span>File</span>
                            <span className="font-medium">{invoice.torrentFileName || `Invoice #${invoice.id}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Amount</span>
                            <span className="font-medium">{formatNCurrency(finalAmount)}</span>
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
                            You need {formatNCurrency(finalAmount - balance)} more to complete this payment.
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

