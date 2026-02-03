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

// ============================================
// Google Drive Configuration Schema (User OAuth Credentials)
// ============================================

export const ConfigureGoogleDriveRequestSchema = z.object({
    profileName: profileNameSchema,
    clientId: z.string()
        .min(1, 'Client ID is required')
        .regex(
            /\.apps\.googleusercontent\.com$/,
            'Client ID must end with .apps.googleusercontent.com'
        ),
    clientSecret: z.string()
        .min(1, 'Client Secret is required'),
    redirectUri: z.string()
        .url('Redirect URI must be a valid URL'),
    setAsDefault: z.boolean(),
})

export const GoogleDriveCallbackResponseSchema = z.object({
    value: z.number(),
})

// ============================================
// S3 Configuration Schema
// ============================================

export const ConfigureS3RequestSchema = z.object({
    profileName: profileNameSchema,
    s3Endpoint: z.string()
        .min(1, 'Endpoint is required')
        .url('Endpoint must be a valid URL'),
    s3AccessKey: z.string()
        .min(1, 'Access Key is required'),
    s3SecretKey: z.string()
        .min(1, 'Secret Key is required'),
    s3BucketName: z.string()
        .min(1, 'Bucket Name is required')
        .max(63, 'Bucket name must be at most 63 characters')
        .regex(
            /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
            'Bucket name must start and end with a letter or number, and can only contain lowercase letters, numbers, hyphens, and periods'
        ),
    s3Region: z.string()
        .min(1, 'Region is required'),
    setAsDefault: z.boolean(),
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
export type ConfigureGoogleDriveRequest = z.infer<typeof ConfigureGoogleDriveRequestSchema>
export type ConfigureS3Request = z.infer<typeof ConfigureS3RequestSchema>

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

// ============================================
// Error Messages
// ============================================

export const storageErrorMessages: Record<string, string> = {
    'AUTH_URL_ERROR': 'Failed to generate authorization URL. Please try again.',
    'INVALID_STATE': 'The authorization state is invalid or expired. Please try again.',
    'USER_MISMATCH': 'Authentication error. Please log in again.',
    'TOKEN_EXCHANGE_FAILED': 'Failed to exchange authorization code for tokens. Please verify your credentials match those in Google Cloud Console.',
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
    'INVALID_CLIENT_ID': 'Invalid Google OAuth Client ID. Ensure it ends with .apps.googleusercontent.com',
    'INVALID_CLIENT_SECRET': 'Client Secret is required.',
    'INVALID_REDIRECT_URI': 'Invalid redirect URI. Please verify the URL is correct.',
    // S3 errors
    'INVALID_S3_ENDPOINT': 'Invalid S3 endpoint URL.',
    'INVALID_S3_CREDENTIALS': 'Invalid S3 access key or secret key.',
    'INVALID_S3_BUCKET': 'Invalid S3 bucket name or bucket does not exist.',
    'S3_CONNECTION_FAILED': 'Failed to connect to S3. Please verify your credentials and endpoint.',
    'S3_ACCESS_DENIED': 'Access denied. Please check your S3 permissions.',
}

export function getStorageErrorMessage(code: string, fallback?: string): string {
    return storageErrorMessages[code] || fallback || 'An unexpected error occurred'
}
