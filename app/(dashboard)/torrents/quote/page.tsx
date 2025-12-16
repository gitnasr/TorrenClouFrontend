'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Tag, Check, X, Zap, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { formatFileSize, formatCurrency, getTimeRemaining } from '@/lib/utils/formatters'
import { mockQuoteResponse, mockWalletBalance, mockVouchers } from '@/lib/mockData'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal'

export default function TorrentQuotePage() {
    const router = useRouter()
    const [voucherCode, setVoucherCode] = useState('')
    const [appliedVoucher, setAppliedVoucher] = useState<typeof mockVouchers[0] | null>(null)
    const [isValidating, setIsValidating] = useState(false)
    const [isPaying, setIsPaying] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showInsufficientModal, setShowInsufficientModal] = useState(false)

    const quote = mockQuoteResponse
    const balance = mockWalletBalance.balance
    const pricing = quote.pricingDetails

    // Calculate discount
    const voucherDiscount = appliedVoucher
        ? (appliedVoucher.type === 'Percentage'
            ? quote.finalAmountInUSD * (appliedVoucher.value / 100)
            : appliedVoucher.value)
        : 0
    const finalAmount = quote.finalAmountInUSD - voucherDiscount
    const hasInsufficientBalance = balance < finalAmount

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
            toast.error('Please enter a voucher code')
            return
        }

        setIsValidating(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const voucher = mockVouchers.find(
            (v) => v.code.toLowerCase() === voucherCode.toLowerCase() && v.isActive
        )

        if (voucher) {
            setAppliedVoucher(voucher)
            toast.success(`Voucher applied! ${voucher.type === 'Percentage' ? `${voucher.value}% discount` : `$${voucher.value} off`}`)
        } else {
            toast.error('Invalid or expired voucher code')
        }

        setIsValidating(false)
    }

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null)
        setVoucherCode('')
    }

    const handlePay = () => {
        if (hasInsufficientBalance) {
            setShowInsufficientModal(true)
            return
        }
        setShowPaymentModal(true)
    }

    const confirmPayment = async () => {
        setIsPaying(true)

        // Simulate payment
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setShowPaymentModal(false)
        toast.success('Payment successful! Job created.')
        router.push('/torrents/jobs')
    }

    const expiryInfo = getTimeRemaining(new Date(Date.now() + 30 * 60 * 1000).toISOString())

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
                    <h1 className="text-2xl font-bold">Quote</h1>
                    <p className="text-muted-foreground">Review pricing and complete your payment</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Torrent Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{quote.fileName}</CardTitle>
                            <CardDescription>
                                {formatFileSize(quote.sizeInBytes)} • {quote.torrentHealth.seeders} seeders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {quote.isCached && (
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
                                        <p className="text-xs text-muted-foreground">{expiryInfo.formatted}</p>
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
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Size ({pricing.totalSizeInGb.toFixed(2)} GB × ${pricing.baseRatePerGb}/GB)</span>
                                <span>{formatCurrency(pricing.totalSizeInGb * pricing.baseRatePerGb)}</span>
                            </div>
                            {pricing.regionMultiplier !== 1 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Region adjustment ({pricing.userRegion})</span>
                                    <span>×{pricing.regionMultiplier}</span>
                                </div>
                            )}
                            {pricing.healthMultiplier !== 1 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Health adjustment</span>
                                    <span className="text-teal-secondary">×{pricing.healthMultiplier}</span>
                                </div>
                            )}
                            {pricing.isCacheHit && pricing.cacheDiscountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Zap className="h-3.5 w-3.5 text-warning" />
                                        Cache discount
                                    </span>
                                    <span className="text-teal-secondary">-{formatCurrency(pricing.cacheDiscountAmount)}</span>
                                </div>
                            )}
                            {appliedVoucher && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Tag className="h-3.5 w-3.5 text-primary" />
                                        Voucher ({appliedVoucher.code})
                                    </span>
                                    <span className="text-teal-secondary">-{formatCurrency(voucherDiscount)}</span>
                                </div>
                            )}
                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(finalAmount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Voucher Input */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Voucher Code
                            </CardTitle>
                            <CardDescription>Have a voucher? Enter it below to get a discount</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appliedVoucher ? (
                                <div className="flex items-center justify-between rounded-lg border border-teal-secondary/50 bg-teal-secondary/10 p-3">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-teal-secondary" />
                                        <div>
                                            <p className="font-medium">{appliedVoucher.code}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {appliedVoucher.type === 'Percentage'
                                                    ? `${appliedVoucher.value}% discount`
                                                    : `$${appliedVoucher.value} off`}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleRemoveVoucher}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter voucher code"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleApplyVoucher} disabled={isValidating}>
                                        {isValidating ? 'Validating...' : 'Apply'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Payment */}
                <div className="space-y-4">
                    <Card className={cn(
                        hasInsufficientBalance && 'border-sage/50'
                    )}>
                        <CardHeader>
                            <CardTitle className="text-base">Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Your balance</span>
                                <span className="font-medium">{formatCurrency(balance)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Invoice amount</span>
                                <span className="font-medium">{formatCurrency(finalAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                                <span className="text-muted-foreground">Balance after</span>
                                <span className={cn(
                                    'font-medium',
                                    hasInsufficientBalance ? 'text-sage' : 'text-teal-secondary'
                                )}>
                                    {formatCurrency(balance - finalAmount)}
                                </span>
                            </div>

                            {hasInsufficientBalance && (
                                <div className="flex items-start gap-2 rounded-lg bg-sage/10 p-3 text-sm">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-sage mt-0.5" />
                                    <p className="text-sage">
                                        Insufficient balance. You need {formatCurrency(finalAmount - balance)} more.
                                    </p>
                                </div>
                            )}

                            <Button onClick={handlePay} className="w-full" size="lg">
                                {hasInsufficientBalance ? 'Add Funds to Pay' : `Pay ${formatCurrency(finalAmount)}`}
                            </Button>
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
                            You are about to pay {formatCurrency(finalAmount)} for this download.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-between text-sm">
                            <span>File</span>
                            <span className="font-medium">{quote.fileName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Amount</span>
                            <span className="font-medium">{formatCurrency(finalAmount)}</span>
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
                            You need {formatCurrency(finalAmount - balance)} more to complete this payment.
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

