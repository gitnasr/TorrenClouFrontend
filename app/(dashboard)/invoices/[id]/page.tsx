'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useInvoice } from '@/hooks/useInvoices'
import { InvoiceView } from '@/components/invoices'

export default function InvoiceDetailPage() {
    const params = useParams()
    const invoiceId = Number(params.id)

    const { data: invoice, isLoading, error, refetch } = useInvoice(invoiceId)

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Error state
    if (error || !invoice) {
        return (
            <div className="space-y-8 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Failed to load invoice</h3>
                        <p className="text-muted-foreground mb-4">
                            {error?.message || 'Invoice not found'}
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <InvoiceView invoice={invoice} />
}
