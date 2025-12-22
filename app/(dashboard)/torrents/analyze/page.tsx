'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    Copy,
    Check,
    Loader2,
    Tag,
    X,
    Zap,
    Clock,
    AlertCircle,
    Cloud,
} from 'lucide-react'
import { formatFileSize, formatInfoHash, formatCurrency, calculateTorrentHealth, getTimeRemaining } from '@/lib/utils/formatters'
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

import { useTorrentStore } from '@/stores/torrentStore'
import { useTorrentQuote } from '@/hooks/useTorrents'
import { useWalletBalance, useInvoicePayment } from '@/hooks/usePayments'
import { StorageProfileSelector } from '@/components/storage'

export default function TorrentAnalyzePage() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [voucherCode, setVoucherCode] = useState('')
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showInsufficientModal, setShowInsufficientModal] = useState(false)

    // Zustand store
    const {
        analysisResult,
        selectedFilePaths,
        quoteResult,
        toggleFileSelection,
        selectAllFiles,
        deselectAllFiles,
        selectedStorageProfileId,
    } = useTorrentStore()

    // API hooks
    const { mutate: getQuote, isPending: isGettingQuote } = useTorrentQuote()
    const { data: walletData, isLoading: isLoadingBalance } = useWalletBalance()
    const { mutate: payInvoice, isPending: isPaying } = useInvoicePayment()

    // Redirect to upload if no analysis result
    useEffect(() => {
        if (!analysisResult) {
            router.push('/torrents/upload')
        }
    }, [analysisResult, router])

    if (!analysisResult) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Calculate health from scrape result
    const health = calculateTorrentHealth(analysisResult.scrapeResult)

    // Calculate selected size
    const selectedSize = analysisResult.files
        .filter((f) => selectedFilePaths.includes(f.path))
        .reduce((acc, f) => acc + f.size, 0)

    const handleCopyHash = () => {
        navigator.clipboard.writeText(analysisResult.infoHash)
        setCopied(true)
        toast.success('Info hash copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleGetQuote = () => {
        if (selectedFilePaths.length === 0) {
            toast.error('Please select at least one file')
            return
        }
        if (!selectedStorageProfileId) {
            toast.error('Please select a storage destination')
            return
        }
        getQuote(voucherCode || undefined)
    }

    const handlePay = () => {
        if (!quoteResult) return

        const balance = walletData?.balance ?? 0
        const finalAmount = quoteResult.finalAmountInUSD

        if (balance < finalAmount) {
            setShowInsufficientModal(true)
            return
        }
        setShowPaymentModal(true)
    }

    const confirmPayment = () => {
        if (!quoteResult) return
        payInvoice(quoteResult.invoiceId)
        setShowPaymentModal(false)
    }

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-teal-secondary'
        if (score >= 50) return 'text-warning'
        return 'text-sage'
    }

    const balance = walletData?.balance ?? 0
    const finalAmount = quoteResult?.finalAmountInUSD ?? 0
    const hasInsufficientBalance = quoteResult ? balance < finalAmount : false

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/torrents/upload">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Torrent Analysis</h1>
                    <p className="text-muted-foreground">Review and select files to download</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Torrent Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {analysisResult.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span className="font-mono text-xs">{formatInfoHash(analysisResult.infoHash, 12)}</span>
                                <button onClick={handleCopyHash} className="text-primary hover:text-primary/80">
                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Size</p>
                                    <p className="font-medium">{formatFileSize(analysisResult.totalSize)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Files</p>
                                    <p className="font-medium">{analysisResult.files.length} files</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Trackers</p>
                                    <p className="font-medium">{analysisResult.trackers.length} trackers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Selection */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Select Files</CardTitle>
                                <CardDescription>
                                    Choose which files to download ({selectedFilePaths.length} of {analysisResult.files.length} selected)
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={selectAllFiles}>
                                    Select All
                                </Button>
                                <Button variant="outline" size="sm" onClick={deselectAllFiles}>
                                    Deselect All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {analysisResult.files.map((file) => (
                                    <div
                                        key={file.index}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer',
                                            selectedFilePaths.includes(file.path)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-muted/50'
                                        )}
                                        onClick={() => toggleFileSelection(file.path)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFilePaths.includes(file.path)}
                                            onChange={() => toggleFileSelection(file.path)}
                                            className="h-4 w-4 rounded border-muted-foreground"
                                        />
                                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{file.path}</p>
                                        </div>
                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quote Result - Pricing Breakdown */}
                    {quoteResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Pricing Breakdown</span>
                                    {quoteResult.isCached && (
                                        <Badge variant="warning" className="flex items-center gap-1">
                                            <Zap className="h-3 w-3" />
                                            Cached
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Size ({quoteResult.pricingDetails.calculatedSizeInGb.toFixed(2)} GB × ${quoteResult.pricingDetails.baseRatePerGb}/GB)
                                    </span>
                                    <span>{formatCurrency(quoteResult.pricingDetails.calculatedSizeInGb * quoteResult.pricingDetails.baseRatePerGb, 'USD')}</span>
                                </div>
                                {quoteResult.pricingDetails.regionMultiplier !== 1 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Region adjustment ({quoteResult.pricingDetails.userRegion})</span>
                                        <span>×{quoteResult.pricingDetails.regionMultiplier}</span>
                                    </div>
                                )}
                                {quoteResult.pricingDetails.healthMultiplier !== 1 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Health adjustment</span>
                                        <span className="text-teal-secondary">×{quoteResult.pricingDetails.healthMultiplier}</span>
                                    </div>
                                )}
                                {quoteResult.pricingDetails.isCacheHit && quoteResult.pricingDetails.cacheDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Zap className="h-3.5 w-3.5 text-warning" />
                                            Cache discount
                                        </span>
                                        <span className="text-teal-secondary">-{formatCurrency(quoteResult.pricingDetails.cacheDiscountAmount, 'USD')}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total</span>
                                        <span className="text-2xl font-bold text-primary">{formatCurrency(quoteResult.finalAmountInUSD, 'USD')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Storage Profile Selection */}
                    {!quoteResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cloud className="h-5 w-5" />
                                    Storage Destination
                                </CardTitle>
                                <CardDescription>Select where to upload your files</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StorageProfileSelector />
                            </CardContent>
                        </Card>
                    )}

                    {/* Voucher Input */}
                    {!quoteResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Voucher Code
                                </CardTitle>
                                <CardDescription>Have a voucher? Enter it before getting a quote</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter voucher code"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Health Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Torrent Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className={cn('text-4xl font-bold', getHealthColor(health.healthScore))}>
                                    {health.healthScore}%
                                </p>
                                <div className="mt-2 flex justify-center gap-2">
                                    {health.isHealthy && <Badge variant="success">Healthy</Badge>}
                                    {health.isWeak && <Badge variant="warning">Weak</Badge>}
                                    {health.isDead && <Badge variant="destructive">Dead</Badge>}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium text-teal-secondary">{analysisResult.scrapeResult.seeders}</p>
                                    <p className="text-xs text-muted-foreground">Seeders</p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium text-sage">{analysisResult.scrapeResult.leechers}</p>
                                    <p className="text-xs text-muted-foreground">Leechers</p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium">{analysisResult.scrapeResult.completed}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selection Summary / Quote / Payment */}
                    <Card className={cn(quoteResult && hasInsufficientBalance && 'border-sage/50')}>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {quoteResult ? 'Payment' : 'Selection Summary'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!quoteResult ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Selected files</span>
                                        <span className="font-medium">{selectedFilePaths.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Total size</span>
                                        <span className="font-medium">{formatFileSize(selectedSize)}</span>
                                    </div>
                                    <Button
                                        onClick={handleGetQuote}
                                        className="w-full"
                                        disabled={selectedFilePaths.length === 0 || !selectedStorageProfileId || isGettingQuote}
                                    >
                                        {isGettingQuote ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Getting Quote...
                                            </>
                                        ) : (
                                            <>
                                                Get Quote
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
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

                                    <Button onClick={handlePay} className="w-full" size="lg">
                                        {hasInsufficientBalance ? 'Add Funds to Pay' : `Pay ${formatCurrency(finalAmount, 'USD')}`}
                                    </Button>
                                </>
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
                            <span className="font-medium">{quoteResult?.fileName}</span>
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
