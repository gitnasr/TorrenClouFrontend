// Storage Profile Types with Zod Validation
import { z } from 'zod'
import { StorageProviderType } from './enums'

// ============================================
// Zod Schemas
// ============================================

export const profileNameSchema = z
    .string()
    .min(3, 'Profile name must be at least 3 characters')
    .max(50, 'Profile name must be at most 50 characters')
    .regex(
        /^[a-zA-Z0-9\s\-_]+$/,
        'Profile name can only contain letters, numbers, spaces, hyphens, and underscores'
    )
    .trim()

export const StorageProfileSchema = z.object({
    id: z.number(),
    profileName: z.string(),
    providerType: z.nativeEnum(StorageProviderType),
    email: z.string().nullable(),
    isDefault: z.boolean(),
    isActive: z.boolean(),
    createdAt: z.string(),
})

export const StorageProfileDetailSchema = StorageProfileSchema.extend({
    updatedAt: z.string().nullable(),
})

export const GoogleDriveConnectResponseSchema = z.object({
    authorizationUrl: z.string().url(),
})

export const GoogleDriveCallbackResponseSchema = z.object({
    value: z.number(),
})

export const StorageApiErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
})

export const StorageProfilesArraySchema = z.array(StorageProfileSchema)

// ============================================
// Inferred Types from Schemas
// ============================================

export type ProfileName = z.infer<typeof profileNameSchema>
export type StorageProfile = z.infer<typeof StorageProfileSchema>
export type StorageProfileDetail = z.infer<typeof StorageProfileDetailSchema>
export type GoogleDriveConnectResponse = z.infer<typeof GoogleDriveConnectResponseSchema>
export type GoogleDriveCallbackResponse = z.infer<typeof GoogleDriveCallbackResponseSchema>
export type StorageApiError = z.infer<typeof StorageApiErrorSchema>

// ============================================
// Component Props Types
// ============================================

export interface StorageProfileCardProps {
    profile: StorageProfile
    onSetDefault?: (id: number) => Promise<void>
    onDelete?: (id: number) => Promise<void>
    className?: string
}

export interface StorageProfilesListProps {
    className?: string
}

export interface ConnectGoogleDriveButtonProps {
    onSuccess?: (profileId: number) => void
    onError?: (error: string) => void
    className?: string
}

// ============================================
// Error Messages
// ============================================

export const storageErrorMessages: Record<string, string> = {
    'AUTH_URL_ERROR': 'Failed to generate authorization URL. Please try again.',
    'INVALID_STATE': 'The connection request has expired. Please try again.',
    'USER_MISMATCH': 'Authentication error. Please log in again.',
    'TOKEN_EXCHANGE_FAILED': 'Failed to complete connection with Google. Please try again.',
    'OAUTH_CALLBACK_ERROR': 'An error occurred during connection. Please try again later.',
    'PROFILE_NOT_FOUND': 'Storage profile not found.',
    'REDIS_ERROR': 'Service temporarily unavailable. Please try again later.',
    'POPUP_BLOCKED': 'Popup blocked. Please allow popups for this site.',
    'AUTHORIZATION_CANCELLED': 'Authorization was cancelled.',
    'AUTHORIZATION_TIMEOUT': 'Authorization timed out. Please try again.',
    'INVALID_PROFILE_NAME': 'Profile name contains invalid characters. Use only letters, numbers, spaces, hyphens, and underscores.',
    'PROFILE_NAME_TOO_SHORT': 'Profile name must be at least 3 characters.',
    'PROFILE_NAME_TOO_LONG': 'Profile name must be at most 50 characters.',
    'DUPLICATE_EMAIL': 'This Google account is already connected. Please use a different account.',
}

export function getStorageErrorMessage(code: string, fallback?: string): string {
    return storageErrorMessages[code] || fallback || 'An unexpected error occurred'
}
