'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, formatNCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { Invoice } from '@/types/invoices'

interface PaymentInfoCardProps {
    invoice: Invoice
}

export function PaymentInfoCard({ invoice }: PaymentInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">Wallet Balance</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className={cn(
                        'font-medium',
                        invoice.isPaid ? 'text-success' : 
                        invoice.isCancelled ? 'text-destructive' :
                        invoice.isRefunded ? 'text-muted-foreground' : 'text-warning'
                    )}>
                        {invoice.isPaid ? 'Completed' : 
                         invoice.isCancelled ? 'Cancelled' :
                         invoice.isRefunded ? 'Refunded' : 'Pending'}
                    </span>
                </div>
                {invoice.paidAt && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid At</span>
                        <span className="font-medium">{formatDateTime(invoice.paidAt)}</span>
                    </div>
                )}
                {invoice.refundedAt && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Refunded At</span>
                        <span className="font-medium">{formatDateTime(invoice.refundedAt)}</span>
                    </div>
                )}
                <div className="border-t pt-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-bold text-primary">{formatNCurrency(invoice.finalAmountInNCurrency)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

