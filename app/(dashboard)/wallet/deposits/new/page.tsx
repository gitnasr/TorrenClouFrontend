'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Wallet, Info, Loader2, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'
import { formatNCurrency, formatExchangeRate, CHARGING_EXCHANGE_RATE, usdToN } from '@/lib/utils/formatters'
import { useStablecoinMinimumAmounts, useCryptoDeposit } from '@/hooks/usePayments'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CryptoDepositRequestDto } from '@/types/wallet'

// Supported currencies with their display info
const currencyInfo: Record<string, { label: string; network: string }> = {
    'USDT': { label: 'USDT (Tether)', network: 'TRC20/ERC20' },
    'USDC': { label: 'USDC (USD Coin)', network: 'ERC20' },
    'DAI': { label: 'DAI (MakerDAO)', network: 'ERC20' },
    'LTC': { label: 'LTC (Litecoin)', network: 'Litecoin Network' },
}

export default function NewDepositPage() {
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState<'USDT' | 'USDC' | 'DAI' | 'LTC'>('USDT')

    // Fetch stablecoin minimum amounts from API
    const { 
        data: stablecoinData, 
        isLoading: isLoadingStablecoins, 
        error: stablecoinError 
    } = useStablecoinMinimumAmounts()

    // Crypto deposit mutation
    const cryptoDeposit = useCryptoDeposit()

    // Current exchange rate (1 N = 1 USD for charging)
    const exchangeRate = CHARGING_EXCHANGE_RATE

    // Get available currencies from API response
    const availableCurrencies = useMemo(() => {
        if (!stablecoinData?.stablecoins) return []
        return stablecoinData.stablecoins.map(coin => ({
            value: coin.currency,
            label: currencyInfo[coin.currency]?.label || coin.currency,
            network: currencyInfo[coin.currency]?.network || '',
            minAmount: coin.minAmount,
        }))
    }, [stablecoinData])

    // Get minimum amount for selected currency
    const minAmount = useMemo(() => {
        const coin = stablecoinData?.stablecoins.find(s => s.currency === currency)
        return coin?.minAmount || 1
    }, [stablecoinData, currency])

    const maxAmount = 10000
    const numericAmount = Number(amount) || 0
    const isValidAmount = numericAmount >= minAmount && numericAmount <= maxAmount

    // Calculate N coins user will receive
    const nCoinsReceived = usdToN(numericAmount, exchangeRate)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isValidAmount) {
            return
        }

        const request: CryptoDepositRequestDto = {
            amount: numericAmount,
            currency,
        }

        cryptoDeposit.mutate(request)
    }

    // Loading state for stablecoin data
    if (isLoadingStablecoins) {
        return (
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/wallet">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Buy N Coins</h1>
                        <p className="text-muted-foreground">Convert stablecoins to N virtual currency</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Error state
    if (stablecoinError) {
        return (
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/wallet">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Buy N Coins</h1>
                        <p className="text-muted-foreground">Convert stablecoins to N virtual currency</p>
                    </div>
                </div>
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <p className="text-destructive">
                            Failed to load payment options. Please try again later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/wallet">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Buy N Coins</h1>
                    <p className="text-muted-foreground">Convert stablecoins to N virtual currency</p>
                </div>
            </div>

            {/* Exchange Rate Banner */}
            <Card className="border-mint/20 bg-mint/5">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-mint/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-mint" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Current Exchange Rate</p>
                            <p className="text-lg font-bold text-mint">{formatExchangeRate(exchangeRate)}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-[200px] text-right">
                        Rate locked at time of deposit. Changes do not affect pending deposits.
                    </p>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            Deposit Details
                        </CardTitle>
                        <CardDescription>
                            Choose your stablecoin and amount
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Currency Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Stablecoin</label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {availableCurrencies.map((curr) => (
                                    <button
                                        key={curr.value}
                                        type="button"
                                        onClick={() => setCurrency(curr.value as 'USDT' | 'USDC' | 'DAI' | 'LTC')}
                                        className={cn(
                                            'flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                                            currency === curr.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-muted/50'
                                        )}
                                    >
                                        <span className="font-medium">{curr.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {curr.network} • Min: ${curr.minAmount}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-7 text-lg"
                                    min={minAmount}
                                    max={maxAmount}
                                    step="0.01"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Min: ${minAmount} USD • Max: ${maxAmount.toLocaleString()} USD
                            </p>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quick Amount</label>
                            <div className="flex flex-wrap gap-2">
                                {[25, 50, 100, 200, 500].map((amt) => (
                                    <Button
                                        key={amt}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAmount(String(amt))}
                                        className={cn(amount === String(amt) && 'border-primary')}
                                        disabled={amt < minAmount}
                                    >
                                        ${amt}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Conversion Summary */}
                        {amount && numericAmount > 0 && (
                            <div className="rounded-lg bg-muted p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">${numericAmount.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">{currency}</p>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{nCoinsReceived.toFixed(2)} N</p>
                                        <p className="text-xs text-muted-foreground">N Coins</p>
                                    </div>
                                </div>
                                <div className="border-t pt-3 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Deposit Amount</span>
                                        <span>${numericAmount.toFixed(2)} {currency}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Exchange Rate</span>
                                        <span>{formatExchangeRate(exchangeRate)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                                        <span>You Will Receive</span>
                                        <span className="text-primary">{formatNCurrency(nCoinsReceived)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={!isValidAmount || cryptoDeposit.isPending}
                        >
                            {cryptoDeposit.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Deposit...
                                </>
                            ) : (
                                `Buy ${formatNCurrency(nCoinsReceived)}`
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Info Card */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex gap-3 pt-6">
                    <Info className="h-5 w-5 shrink-0 text-primary" />
                    <div className="space-y-1 text-sm">
                        <p className="font-medium">How N Coins Work</p>
                        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            <li>N is TorreClou&apos;s virtual currency for all payments</li>
                            <li>Exchange rate is locked when you create a deposit</li>
                            <li>Use N coins to pay for downloads and storage</li>
                            <li>Your N coin balance never expires</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
