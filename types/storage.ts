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
        .max(500, 'Client ID is too long')
        .regex(
            /\.apps\.googleusercontent\.com$/,
            'Client ID must end with .apps.googleusercontent.com'
        ),
    clientSecret: z.string()
        .min(1, 'Client Secret is required')
        .max(500, 'Client Secret is too long'),
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
    // Backend error codes (PascalCase - matching backend v2 format)
    'AuthUrlError': 'Failed to generate authorization URL. Please try again.',
    'InvalidState': 'The authorization state is invalid or expired. Please try again.',
    'UserMismatch': 'Authentication error. Please log in again.',
    'TokenExchangeFailed': 'Failed to exchange authorization code for tokens. Please verify your credentials match those in Google Cloud Console.',
    'OauthCallbackError': 'An error occurred during connection. Please try again later.',
    'ProfileNotFound': 'Storage profile not found.',
    'RedisError': 'Service temporarily unavailable. Please try again later.',
    'InvalidProfileName': 'Profile name contains invalid characters. Use only letters, numbers, spaces, hyphens, and underscores.',
    'ProfileNameTooShort': 'Profile name must be at least 3 characters.',
    'ProfileNameTooLong': 'Profile name must be at most 50 characters.',
    'DuplicateEmail': 'This Google account is already connected. Please use a different account.',
    'InvalidClientId': 'Invalid Google OAuth Client ID. Ensure it ends with .apps.googleusercontent.com',
    'InvalidClientSecret': 'Client Secret is required.',
    'InvalidRedirectUri': 'Invalid redirect URI. Please verify the URL is correct.',
    // S3 errors
    'InvalidS3Config': 'One or more S3 configuration fields are invalid.',
    'InvalidS3Endpoint': 'Invalid S3 endpoint URL.',
    'InvalidS3Credentials': 'Invalid S3 access key or secret key.',
    'InvalidS3Bucket': 'Invalid S3 bucket name or bucket does not exist.',
    'S3ConnectionFailed': 'Failed to connect to S3. Please verify your credentials and endpoint.',
    'S3AccessDenied': 'Access denied. Please check your S3 permissions.',
    // Client-side errors (SCREAMING_SNAKE_CASE - thrown locally, not from backend)
    'POPUP_BLOCKED': 'Popup blocked. Please allow popups for this site.',
    'AUTHORIZATION_CANCELLED': 'Authorization was cancelled.',
    'AUTHORIZATION_TIMEOUT': 'Authorization timed out. Please try again.',
}

export function getStorageErrorMessage(code: string, fallback?: string): string {
    return storageErrorMessages[code] || fallback || 'An unexpected error occurred'
}
