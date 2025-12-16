'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Copy,
    Check,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCcw,
    ExternalLink,
    QrCode
} from 'lucide-react'
import { formatCurrency, formatDateTime, getTimeRemaining } from '@/lib/utils/formatters'
import { mockDeposits } from '@/lib/mockData'
import { DepositStatus } from '@/types/enums'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusConfig: Record<DepositStatus, {
    icon: React.ReactNode
    badgeVariant: 'default' | 'warning' | 'destructive'
    color: string
    description: string
}> = {
    [DepositStatus.Pending]: {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        description: 'Waiting for payment',
    },
    [DepositStatus.Completed]: {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'default',
        color: 'text-teal-secondary',
        description: 'Payment received and credited',
    },
    [DepositStatus.Failed]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment failed',
    },
    [DepositStatus.Expired]: {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment link expired',
    },
}

export default function DepositDetailsPage() {
    const params = useParams()
    const depositId = Number(params.id)
    const [copied, setCopied] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState('')

    // Find deposit from mock data
    const deposit = mockDeposits.find((d) => d.id === depositId) || mockDeposits[0]
    const config = statusConfig[deposit.status]

    // Update countdown for pending deposits
    useEffect(() => {
        if (deposit.status === DepositStatus.Pending) {
            const updateTime = () => {
                const expiry = new Date(Date.now() + 25 * 60 * 1000) // Mock 25 min remaining
                const remaining = getTimeRemaining(expiry.toISOString())
                setTimeRemaining(remaining.formatted)
            }
            updateTime()
            const interval = setInterval(updateTime, 60000)
            return () => clearInterval(interval)
        }
    }, [deposit.status])

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const mockPaymentUrl = 'https://pay.example.com/deposit/abc123xyz'
    const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8E2aB'

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/wallet/deposits">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Deposit #{deposit.id}</h1>
                    <p className="text-muted-foreground">View deposit details</p>
                </div>
            </div>

            {/* Status Card */}
            <Card className={cn(
                deposit.status === DepositStatus.Pending && 'border-warning/50 bg-warning/5',
                deposit.status === DepositStatus.Completed && 'border-teal-secondary/50 bg-teal-secondary/5',
                [DepositStatus.Failed, DepositStatus.Expired].includes(deposit.status) && 'border-orange/50 bg-orange/5'
            )}>
                <CardContent className="flex items-center gap-4 pt-6">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', config.color)}>
                        {config.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">{deposit.status}</h2>
                            <Badge variant={config.badgeVariant}>{deposit.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Section (for pending) */}
            {deposit.status === DepositStatus.Pending && (
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Your Payment</CardTitle>
                        <CardDescription>
                            Send exactly {formatCurrency(deposit.amount)} worth of {deposit.currency}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Countdown */}
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                            <span className="text-sm text-muted-foreground">Time remaining</span>
                            <span className="font-mono font-medium text-warning">{timeRemaining}</span>
                        </div>

                        {/* Payment URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Link</label>
                            <div className="flex gap-2">
                                <div className="flex-1 rounded-lg border bg-muted p-3 font-mono text-xs break-all">
                                    {mockPaymentUrl}
                                </div>
                                <Button variant="outline" size="icon" onClick={() => handleCopy(mockPaymentUrl)}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Open Payment Button */}
                        <Button asChild className="w-full">
                            <a href={mockPaymentUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Payment Page
                            </a>
                        </Button>

                        {/* Wallet Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Or send to this address</label>
                            <div className="flex gap-2">
                                <div className="flex-1 rounded-lg border bg-muted p-3 font-mono text-xs break-all">
                                    {mockWalletAddress}
                                </div>
                                <Button variant="outline" size="icon" onClick={() => handleCopy(mockWalletAddress)}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Refresh Status */}
                        <Button variant="outline" className="w-full" onClick={() => toast.info('Checking status...')}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refresh Status
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Deposit Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Deposit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-medium">{formatCurrency(deposit.amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="font-medium">{deposit.currency}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">{formatDateTime(deposit.createdAt)}</p>
                        </div>
                        {deposit.updatedAt && (
                            <div>
                                <p className="text-sm text-muted-foreground">Updated</p>
                                <p className="font-medium">{formatDateTime(deposit.updatedAt)}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Payment Provider</p>
                            <p className="font-medium">{deposit.paymentProvider}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions for failed/expired */}
            {[DepositStatus.Failed, DepositStatus.Expired].includes(deposit.status) && (
                <Card>
                    <CardContent className="pt-6">
                        <Button asChild className="w-full">
                            <Link href="/wallet/deposits/new">Create New Deposit</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
