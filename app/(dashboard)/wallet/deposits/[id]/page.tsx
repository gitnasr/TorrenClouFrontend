'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useDeposit } from '@/hooks/usePayments'
import { toast } from 'sonner'
import Link from 'next/link'
import {
    DepositSkeleton,
    DepositStatusCard,
    DepositPaymentSection,
    DepositDetailsCard,
    DepositErrorState,
} from '@/components/wallet'

export default function DepositDetailsPage() {
    const params = useParams()
    const depositId = Number(params.id)

    // Fetch deposit from API
    const { data: deposit, isLoading, error, refetch, isRefetching } = useDeposit(depositId)

    const handleRefresh = async () => {
        toast.info('Checking status...')
        await refetch()
    }

    // Loading state
    if (isLoading) {
        return <DepositSkeleton />
    }

    // Error state
    if (error || !deposit) {
        return <DepositErrorState onRetry={() => refetch()} />
    }

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
            <DepositStatusCard deposit={deposit} />

            {/* Payment Section (for pending) */}
            <DepositPaymentSection 
                deposit={deposit} 
                onRefresh={handleRefresh}
                isRefreshing={isRefetching}
            />

            {/* Deposit Details */}
            <DepositDetailsCard deposit={deposit} />

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
