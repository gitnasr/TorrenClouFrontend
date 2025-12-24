'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    ArrowLeft,
    Copy,
    Check,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCcw,
    ExternalLink,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import { useDeposit } from '@/hooks/usePayments'
import type { DepositStatusDto } from '@/types/wallet'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusConfig: Record<DepositStatusDto, {
    icon: React.ReactNode
    badgeVariant: 'default' | 'warning' | 'destructive' | 'success'
    color: string
    description: string
}> = {
    'Pending': {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        description: 'Waiting for payment',
    },
    'Completed': {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'success',
        color: 'text-teal-secondary',
        description: 'Payment received and credited',
    },
    'Failed': {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment failed',
    },
    'Expired': {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment link expired',
    },
}

function DepositDetailsSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/wallet/deposits">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div className="space-y-2">
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-5 w-40" />
                </div>
            </div>
            <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function DepositDetailsPage() {
    const params = useParams()
    const depositId = Number(params.id)
    const [copied, setCopied] = useState(false)

    // Fetch deposit from API
    const { data: deposit, isLoading, error, refetch, isRefetching } = useDeposit(depositId)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRefresh = async () => {
        toast.info('Checking status...')
        await refetch()
    }

    // Loading state
    if (isLoading) {
        return <DepositDetailsSkeleton />
    }

    // Error state
    if (error || !deposit) {
        return (
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/wallet/deposits">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Deposit Details</h1>
                        <p className="text-muted-foreground">View deposit information</p>
                    </div>
                </div>
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <div className="flex-1">
                            <p className="text-destructive font-medium">
                                Failed to load deposit details
                            </p>
                            <p className="text-sm text-muted-foreground">
                                The deposit may not exist or you don&apos;t have access to it.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const config = statusConfig[deposit.status]
    const isPending = deposit.status === 'Pending'
    const isFailed = deposit.status === 'Failed' || deposit.status === 'Expired'

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
                isPending && 'border-warning/50 bg-warning/5',
                deposit.status === 'Completed' && 'border-teal-secondary/50 bg-teal-secondary/5',
                isFailed && 'border-orange/50 bg-orange/5'
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
            {isPending && deposit.paymentUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Your Payment</CardTitle>
                        <CardDescription>
                            Send exactly {formatCurrency(deposit.amount)} worth of {deposit.currency}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Payment URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Link</label>
                            <div className="flex gap-2">
                                <div className="flex-1 rounded-lg border bg-muted p-3 font-mono text-xs break-all">
                                    {deposit.paymentUrl}
                                </div>
                                <Button variant="outline" size="icon" onClick={() => handleCopy(deposit.paymentUrl!)}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Open Payment Button */}
                        <Button asChild className="w-full">
                            <a href={deposit.paymentUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Payment Page
                            </a>
                        </Button>

                        {/* Refresh Status */}
                        <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleRefresh}
                            disabled={isRefetching}
                        >
                            {isRefetching ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="mr-2 h-4 w-4" />
                            )}
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
            {isFailed && (
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
