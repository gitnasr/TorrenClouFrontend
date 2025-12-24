'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { formatNCurrency, getTimeRemaining } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { Invoice } from '@/types/invoices'

interface PaymentCardProps {
    invoice: Invoice
    balance: number
    isLoadingBalance: boolean
    onPay: () => void
}

export function PaymentCard({ 
    invoice, 
    balance,
    isLoadingBalance,
    onPay 
}: PaymentCardProps) {
    const finalAmount = invoice.finalAmountInUSD
    const hasInsufficientBalance = balance < finalAmount
    const expiryInfo = getTimeRemaining(invoice.expiresAt)

    return (
        <Card className={cn(hasInsufficientBalance && 'border-sage/50')}>
            <CardHeader>
                <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Your balance</span>
                    <span className="font-medium">
                        {isLoadingBalance ? '...' : formatNCurrency(balance)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Invoice amount</span>
                    <span className="font-medium">{formatNCurrency(finalAmount)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-muted-foreground">Balance after</span>
                    <span className={cn(
                        'font-medium',
                        hasInsufficientBalance ? 'text-sage' : 'text-teal-secondary'
                    )}>
                        {formatNCurrency(balance - finalAmount)}
                    </span>
                </div>

                {hasInsufficientBalance && (
                    <div className="flex items-start gap-2 rounded-lg bg-sage/10 p-3 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0 text-sage mt-0.5" />
                        <p className="text-sage">
                            Insufficient balance. You need {formatNCurrency(finalAmount - balance)} more.
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
                    <Button onClick={onPay} className="w-full" size="lg" disabled={expiryInfo.isExpired}>
                        {hasInsufficientBalance ? 'Add Funds to Pay' : `Pay ${formatNCurrency(finalAmount)}`}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

