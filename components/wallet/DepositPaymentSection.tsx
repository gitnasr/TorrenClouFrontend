'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, RefreshCcw, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import type { DepositDto } from '@/types/wallet'
import { useWalletStore } from '@/stores/walletStore'

interface DepositPaymentSectionProps {
    deposit: DepositDto
    onRefresh: () => void
    isRefreshing?: boolean
}

export function DepositPaymentSection({ 
    deposit, 
    onRefresh, 
    isRefreshing 
}: DepositPaymentSectionProps) {
    const { copied, copyToClipboard } = useWalletStore()

    if (deposit.status !== 'Pending' || !deposit.paymentUrl) {
        return null
    }

    return (
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
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => copyToClipboard(deposit.paymentUrl!)}
                        >
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
                    onClick={onRefresh}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="mr-2 h-4 w-4" />
                    )}
                    Refresh Status
                </Button>
            </CardContent>
        </Card>
    )
}

