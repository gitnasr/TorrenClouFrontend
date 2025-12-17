// Utility functions for formatting
import { format, formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns'

// Current exchange rate (N coins to USD) - in production this would come from API
export const CURRENT_EXCHANGE_RATE = 1.5 // 1 N = 1.5 USD
export const CURRENCY_SYMBOL = 'N'
export const CURRENCY_NAME = 'N Coins'

/**
 * Format N currency amount
 */
export function formatNCurrency(amount: number): string {
    return `${amount.toFixed(2)} N`
}

/**
 * Format N currency with USD equivalent
 */
export function formatNCurrencyWithUSD(amountInN: number, exchangeRate: number = CURRENT_EXCHANGE_RATE): string {
    const usdAmount = amountInN * exchangeRate
    return `${amountInN.toFixed(2)} N (~$${usdAmount.toFixed(2)} USD)`
}

/**
 * Convert USD to N coins at given exchange rate
 */
export function usdToN(amountUSD: number, exchangeRate: number = CURRENT_EXCHANGE_RATE): number {
    return amountUSD / exchangeRate
}

/**
 * Convert N coins to USD at given exchange rate
 */
export function nToUSD(amountN: number, exchangeRate: number = CURRENT_EXCHANGE_RATE): number {
    return amountN * exchangeRate
}

/**
 * Format currency amount with currency symbol (legacy USD support)
 */
export function formatCurrency(amount: number, currency: string = 'N'): string {
    if (currency === 'N') {
        return formatNCurrency(amount)
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency === 'N' ? 'USD' : currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2)

    return `${formattedSize} ${sizes[i]}`
}

/**
 * Format bytes to gigabytes
 */
export function bytesToGb(bytes: number): number {
    return Number((bytes / (1024 * 1024 * 1024)).toFixed(2))
}

/**
 * Format date in specified format
 */
export function formatDate(
    date: string | Date,
    dateFormat: string = 'MMM dd, yyyy'
): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, dateFormat)
}

/**
 * Format date with time
 */
export function formatDateTime(
    date: string | Date,
    dateFormat: string = 'MMM dd, yyyy HH:mm'
): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, dateFormat)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(parsedDate, { addSuffix: true })
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Get time remaining until a date (for countdowns)
 */
export function getTimeRemaining(expiresAt: string | Date): {
    minutes: number
    isExpired: boolean
    formatted: string
} {
    const expiry = typeof expiresAt === 'string' ? parseISO(expiresAt) : expiresAt
    const now = new Date()
    const minutes = differenceInMinutes(expiry, now)
    const isExpired = minutes <= 0

    if (isExpired) {
        return { minutes: 0, isExpired: true, formatted: 'Expired' }
    }

    if (minutes < 60) {
        return { minutes, isExpired: false, formatted: `${minutes} min` }
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return {
        minutes,
        isExpired: false,
        formatted: `${hours}h ${remainingMinutes}m`,
    }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format info hash for display
 */
export function formatInfoHash(hash: string, length: number = 8): string {
    if (hash.length <= length * 2) return hash
    return `${hash.slice(0, length)}...${hash.slice(-length)}`
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Format exchange rate display
 */
export function formatExchangeRate(rate: number): string {
    return `1 N = $${rate.toFixed(2)} USD`
}

/**
 * Calculate torrent health from scrape results
 * Matches backend TorrentHealthService logic:
 * - Health score: 50% seeders count, 30% seeder/leecher ratio, 20% completeness
 * - Health status: Healthy (seeders >= 10), Weak (seeders <= 2), Dead (seeders == 0 && leechers == 0)
 */
export function calculateTorrentHealth(scrapeResult: {
    seeders: number
    leechers: number
    completed: number
}): {
    healthScore: number
    isHealthy: boolean
    isWeak: boolean
    isDead: boolean
    seederRatio: number
} {
    const { seeders, leechers, completed } = scrapeResult

    // Calculate seeder ratio (seeders / leechers)
    const seederRatio = leechers > 0 ? seeders / leechers : seeders > 0 ? Number.MAX_SAFE_INTEGER : 0

    // Check health status
    const isDead = seeders === 0 && leechers === 0
    const isWeak = !isDead && seeders <= 2
    const isHealthy = seeders >= 10

    // Calculate health score (0-100)
    // 50% from seeders count (capped at 100 seeders = max score)
    const seederScore = Math.min(seeders / 100, 1) * 50

    // 30% from seeder/leecher ratio (capped at 10:1 ratio = max score)
    const ratioScore = Math.min(seederRatio / 10, 1) * 30

    // 20% from completeness (having at least 100 completes = max score)
    const completenessScore = Math.min(completed / 100, 1) * 20

    const healthScore = Math.round(seederScore + ratioScore + completenessScore)

    return {
        healthScore,
        isHealthy,
        isWeak,
        isDead,
        seederRatio: Number(seederRatio.toFixed(2)),
    }
}

