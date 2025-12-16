// Color constants for consistent UI styling
// TorreClou Professional Dark Theme

export const COLORS = {
    // Primary (teal)
    primary: '#128775',
    primaryLight: '#a1c9bf',
    primaryMedium: '#3c9483',

    // Surface (grays)
    surface: '#121212',
    surfaceLight: '#3f3f3f',
    surfaceTonal: '#161d1b',

    // Semantic
    success: '#22946e',
    successLight: '#47d5a6',
    warning: '#a87a2a',
    warningLight: '#d7ac61',
    danger: '#9c2121',
    dangerLight: '#d94a4a',
    info: '#21498a',
    infoLight: '#4077d1',
} as const

// Status color mappings
export type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'processing' | 'default'

export const statusColors: Record<StatusType, string> = {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.danger,
    pending: COLORS.warning,
    processing: COLORS.primary,
    default: COLORS.primary,
}

// Badge variant mappings for different entity statuses
export const depositStatusBadgeVariant = {
    Pending: 'warning' as const,
    Completed: 'success' as const,
    Failed: 'destructive' as const,
    Expired: 'destructive' as const,
}

export const jobStatusBadgeVariant = {
    Queued: 'pending' as const,
    Processing: 'processing' as const,
    Uploading: 'secondary' as const,
    Completed: 'success' as const,
    Failed: 'destructive' as const,
    Cancelled: 'secondary' as const,
}

export const transactionTypeBadgeVariant = {
    Deposit: 'success' as const,
    Payment: 'destructive' as const,
    Refund: 'secondary' as const,
    AdminAdjustment: 'warning' as const,
    Bonus: 'warning' as const,
    Deduction: 'destructive' as const,
}
