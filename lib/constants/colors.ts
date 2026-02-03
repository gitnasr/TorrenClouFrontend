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

// Badge variant mappings for job statuses
export const jobStatusBadgeVariant = {
    Queued: 'pending' as const,
    Downloading: 'processing' as const,
    PendingUpload: 'pending' as const,
    Uploading: 'secondary' as const,
    Retrying: 'processing' as const,
    Completed: 'success' as const,
    Failed: 'destructive' as const,
    Cancelled: 'secondary' as const,
}
