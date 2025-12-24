'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Calendar,
    HardDrive,
    Clock,
    CheckCircle,
    Zap,
} from 'lucide-react'
import { formatDateTime, getTimeRemaining } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Invoice } from '@/types/invoices'
import type { PricingSnapshot } from '@/types/torrents'

interface InvoiceSummaryCardProps {
    invoice: Invoice
    isPending: boolean
    pricingDetails: PricingSnapshot | null
}

export function InvoiceSummaryCard({ 
    invoice, 
    isPending,
    pricingDetails 
}: InvoiceSummaryCardProps) {
    // Check if cached based on pricing details
    const isCached = pricingDetails?.isCacheHit ?? false
    const expiryInfo = getTimeRemaining(invoice.expiresAt)

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {invoice.torrentFileName || `Invoice #${invoice.id}`}
                    </CardTitle>
                    {isCached && (
                        <Badge variant="warning" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Cached
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Cache status */}
                    {isCached && (
                        <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
                            <Zap className="h-5 w-5 text-warning" />
                            <div>
                                <p className="text-sm font-medium">Cached</p>
                                <p className="text-xs text-muted-foreground">Instant download available</p>
                            </div>
                        </div>
                    )}

                    {/* Expiry/Date info */}
                    {isPending ? (
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Quote expires in</p>
                                <p className={cn(
                                    "text-xs",
                                    expiryInfo.isExpired ? "text-destructive" : "text-muted-foreground"
                                )}>
                                    {expiryInfo.formatted}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 border border-primary/20">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">Invoice Date</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(invoice.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {invoice.paidAt && (
                                <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
                                    <CheckCircle className="h-5 w-5 text-success" />
                                    <div>
                                        <p className="text-sm font-medium">Paid On</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(invoice.paidAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Related Job */}
                    {invoice.jobId && (
                        <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 border border-blue-500/20">
                            <HardDrive className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Related Job</p>
                                <Link
                                    href={`/jobs/${invoice.jobId}`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Job #{invoice.jobId}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

