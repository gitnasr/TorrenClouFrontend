// Utility functions for formatting
import { format, formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns'

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

/**
 * Format multiplier with percentage change indication
 * Examples:
 * - 1.0 -> "1.0x (Base)"
 * - 1.5 -> "1.5x (50% increase)"
 * - 0.4 -> "0.4x (60% discount)"
 */
export function formatMultiplier(multiplier: number): string {
    if (multiplier === 1.0) return '1.0x (Base)'
    if (multiplier > 1.0) {
        const increase = ((multiplier - 1) * 100).toFixed(0)
        return `${multiplier.toFixed(2)}x (${increase}% increase)`
    }
    const discount = ((1 - multiplier) * 100).toFixed(0)
    return `${multiplier.toFixed(2)}x (${discount}% discount)`
}

/**
 * Map region codes to human-readable names
 */
const regionNames: Record<string, string> = {
    US: 'United States',
    EU: 'Europe',
    EG: 'Egypt',
    IN: 'India',
    SA: 'Saudi Arabia',
    Global: 'Global',
}

/**
 * Format region code to human-readable name
 * Falls back to the code itself if not found in mapping
 */
export function formatRegion(regionCode: string): string {
    return regionNames[regionCode] || regionCode
}
