'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import type { DepositDto } from '@/types/wallet'

interface DepositDetailsCardProps {
    deposit: DepositDto
}

export function DepositDetailsCard({ deposit }: DepositDetailsCardProps) {
    return (
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
    )
}

