// Deposit utility functions for status display and formatting

import type { DepositStatusDto } from '@/types/wallet'

/**
 * Get human-readable label for deposit status
 */
export function getDepositStatusLabel(status: DepositStatusDto): string {
    const labels: Record<DepositStatusDto, string> = {
        'Pending': 'Pending Payment',
        'Completed': 'Completed',
        'Failed': 'Failed',
        'Expired': 'Expired',
    }
    return labels[status] || status
}

/**
 * Get color class for deposit status
 */
export function getDepositStatusColor(status: DepositStatusDto): string {
    const colors: Record<DepositStatusDto, string> = {
        'Pending': 'text-warning',
        'Completed': 'text-teal-secondary',
        'Failed': 'text-destructive',
        'Expired': 'text-muted-foreground',
    }
    return colors[status] || 'text-muted-foreground'
}

/**
 * Get badge variant for deposit status
 */
export function getDepositStatusVariant(
    status: DepositStatusDto
): 'default' | 'warning' | 'destructive' | 'secondary' | 'success' {
    const variants: Record<DepositStatusDto, 'default' | 'warning' | 'destructive' | 'secondary' | 'success'> = {
        'Pending': 'warning',
        'Completed': 'success',
        'Failed': 'destructive',
        'Expired': 'destructive',
    }
    return variants[status] || 'secondary'
}

/**
 * Check if deposit is in a terminal state (cannot change)
 */
export function isDepositTerminal(status: DepositStatusDto): boolean {
    return status === 'Completed' || status === 'Failed' || status === 'Expired'
}

/**
 * Check if deposit is actionable (can still complete payment)
 */
export function isDepositActionable(status: DepositStatusDto): boolean {
    return status === 'Pending'
}

/**
 * Get description for deposit status
 */
export function getDepositStatusDescription(status: DepositStatusDto): string {
    const descriptions: Record<DepositStatusDto, string> = {
        'Pending': 'Waiting for payment to be received',
        'Completed': 'Payment received and credited to your wallet',
        'Failed': 'Payment failed. Please try again.',
        'Expired': 'Payment link has expired. Please create a new deposit.',
    }
    return descriptions[status] || 'Unknown status'
}

/**
 * Currency display info
 */
export const currencyInfo: Record<string, { label: string; network: string; icon?: string }> = {
    'USDT': { label: 'USDT (Tether)', network: 'TRC20/ERC20' },
    'USDC': { label: 'USDC (USD Coin)', network: 'ERC20' },
    'DAI': { label: 'DAI (MakerDAO)', network: 'ERC20' },
    'LTC': { label: 'LTC (Litecoin)', network: 'Litecoin Network' },
}

/**
 * Get currency display label
 */
export function getCurrencyLabel(currency: string): string {
    return currencyInfo[currency]?.label || currency
}

/**
 * Get currency network info
 */
export function getCurrencyNetwork(currency: string): string {
    return currencyInfo[currency]?.network || ''
}


