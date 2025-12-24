'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ChevronDown,
    ChevronUp,
    Coins,
    Info,
    Ticket,
    CheckCircle,
} from 'lucide-react'
import { formatNCurrency, formatExchangeRate, formatUSD, formatMultiplier } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { Invoice } from '@/types/invoices'
import type { PricingSnapshot } from '@/types/torrents'

interface PricingBreakdownProps {
    invoice: Invoice
    pricingSnapshot: PricingSnapshot | null
    showExchangeRate?: boolean
}

export function PricingBreakdown({ 
    invoice, 
    pricingSnapshot,
    showExchangeRate = false 
}: PricingBreakdownProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    
    // Use pricingDetails if available, fallback to pricingSnapshot for backward compatibility
    const pricingDetails = invoice.pricingDetails || pricingSnapshot
    
    // Get pricing calculation values from invoice (with fallbacks)
    // Calculate basePrice: use invoice value if available, otherwise calculate from pricingDetails
    const basePrice = invoice.basePrice ?? (pricingDetails ? pricingDetails.calculatedSizeInGb * pricingDetails.baseRatePerGb * pricingDetails.regionMultiplier : invoice.originalAmountInUSD)
    
    // Calculate priceAfterHealth: use invoice value if available, otherwise calculate from basePrice and healthMultiplier
    const priceAfterHealth = invoice.priceAfterHealth ?? (pricingDetails ? basePrice * pricingDetails.healthMultiplier : invoice.originalAmountInUSD)
    
    const minimumChargeApplied = invoice.minimumChargeApplied ?? false
    const voucher = invoice.voucher
    const voucherDiscountAmount = invoice.voucherDiscountAmount ?? 0

    // Handle missing pricing details gracefully
    if (!pricingDetails) {
        const hasDiscount = invoice.originalAmountInUSD !== invoice.finalAmountInUSD
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Original Amount</span>
                        <span>{formatUSD(invoice.originalAmountInUSD)}</span>
                    </div>
                    {hasDiscount && (
                        <div className="flex justify-between text-sm text-teal-secondary">
                            <span>Discount Applied</span>
                            <span>-{formatUSD(invoice.originalAmountInUSD - invoice.finalAmountInUSD)}</span>
                        </div>
                    )}
                    <div className="border-t pt-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Final Amount</span>
                            <span className="text-2xl font-bold text-primary">{formatUSD(invoice.finalAmountInUSD)}</span>
                        </div>
                    </div>
                    {showExchangeRate && invoice.exchangeRate > 0 && (
                        <div className="border-t pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Coins className="h-3.5 w-3.5" />
                                    Exchange Rate
                                </span>
                                <span>{formatExchangeRate(invoice.exchangeRate)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Amount Charged</span>
                                <span className="font-bold text-primary">{formatNCurrency(invoice.finalAmountInNCurrency)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    const calculatedSize = pricingDetails.calculatedSizeInGb
    const baseRate = pricingDetails.baseRatePerGb
    const regionMultiplier = pricingDetails.regionMultiplier
    const healthMultiplier = pricingDetails.healthMultiplier
    const originalAmount = invoice.originalAmountInUSD
    const finalAmount = invoice.finalAmountInUSD

    return (
        <Card>
            <CardHeader>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
                    aria-expanded={isExpanded}
                    aria-label="Toggle pricing breakdown details"
                >
                    <CardTitle>Pricing Breakdown</CardTitle>
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>
            </CardHeader>
            {isExpanded && (
                <CardContent className="space-y-4">
                    {/* Step 1: Base Price Calculation */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-foreground">Base Price</span>
                                </div>
                                <div 
                                    className="text-xs text-muted-foreground font-mono ml-4"
                                    aria-label={`Base price calculation: ${calculatedSize.toFixed(2)} gigabytes times ${baseRate.toFixed(2)} dollars per gigabyte times ${regionMultiplier.toFixed(2)} region multiplier equals ${basePrice.toFixed(3)} dollars`}
                                >
                                    ({calculatedSize.toFixed(2)} GB × ${baseRate.toFixed(2)} × {regionMultiplier.toFixed(2)}x)
                                </div>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{formatUSD(basePrice)}</span>
                        </div>
                    </div>

                    {/* Step 2: Health Multiplier */}
                    {healthMultiplier !== 1 && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "text-sm font-medium",
                                            healthMultiplier > 1 ? "text-blue-500" : "text-green-500"
                                        )}>
                                            Health Multiplier
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-4">
                                        {formatMultiplier(healthMultiplier)}
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    healthMultiplier > 1 ? "text-blue-500" : "text-green-500"
                                )}>
                                    ×{healthMultiplier.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center ml-4">
                                <span className="text-sm text-muted-foreground">Price After Health</span>
                                <span className="text-sm font-medium">{formatUSD(priceAfterHealth)}</span>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Minimum Charge */}
                    {minimumChargeApplied && (
                        <div className="space-y-2 rounded-lg bg-warning/10 p-3 border border-warning/20">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Info className="h-4 w-4 text-warning" />
                                        <span className="text-sm font-medium text-warning">Minimum Charge Applied</span>
                                        <Badge variant="warning" className="ml-2">$0.20</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-6 mt-1">
                                        Applied because calculated price was below $0.20
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-warning">{formatUSD(0.20)}</span>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Original Amount (before voucher) */}
                    <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Original Amount</span>
                            <span className="text-sm font-medium">{formatUSD(originalAmount)}</span>
                        </div>
                    </div>

                    {/* Step 5: Voucher Discount */}
                    {voucher && voucherDiscountAmount > 0 && (
                        <div className="space-y-2 rounded-lg bg-success/10 p-3 border border-success/20">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Ticket className="h-4 w-4 text-success" />
                                        <span className="text-sm font-medium text-success">
                                            Voucher: {voucher.code}
                                        </span>
                                        <CheckCircle className="h-4 w-4 text-success" />
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-6 mt-1">
                                        {voucher.type === 'Percentage' 
                                            ? `${voucher.value.toFixed(0)}% off`
                                            : `${formatUSD(voucher.value)} off`}
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-success">
                                    -{formatUSD(voucherDiscountAmount)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Final Summary */}
                    <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">Final Amount</span>
                            <span className="text-2xl font-bold text-primary">{formatUSD(finalAmount)}</span>
                        </div>
                    </div>

                    {/* Exchange Rate Section (only for paid invoices) */}
                    {showExchangeRate && invoice.exchangeRate > 0 && (
                        <div className="border-t pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Coins className="h-3.5 w-3.5" />
                                    Exchange Rate
                                </span>
                                <span>{formatExchangeRate(invoice.exchangeRate)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Amount Charged</span>
                                <span className="font-bold text-primary">{formatNCurrency(invoice.finalAmountInNCurrency)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    )
}

