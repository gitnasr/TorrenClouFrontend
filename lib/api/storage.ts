// Storage API client with Zod validation
import apiClient from '../axios'
import {
    StorageProfileSchema,
    StorageProfileDetailSchema,
    StorageProfilesArraySchema,
    SaveGoogleDriveCredentialsRequestSchema,
    SaveGoogleDriveCredentialsResponseSchema,
    GoogleDriveAuthResponseSchema,
    ConfigureS3RequestSchema,
} from '@/types/storage'
import type {
    StorageProfile,
    StorageProfileDetail,
    SaveGoogleDriveCredentialsRequest,
    SaveGoogleDriveCredentialsResponse,
    GoogleDriveAuthResponse,
    ConfigureS3Request,
} from '@/types/storage'

// Re-export types for convenience
export type { StorageProfile, StorageProfileDetail, SaveGoogleDriveCredentialsRequest, SaveGoogleDriveCredentialsResponse, GoogleDriveAuthResponse, ConfigureS3Request }
export { getStorageErrorMessage, storageErrorMessages } from '@/types/storage'

/**
 * Step 1: Save Google OAuth credentials to create a new storage profile
 * POST /api/storage/gdrive/credentials
 *
 * Creates a profile with isConfigured = false. Must be followed by authenticateGoogleDrive.
 */
export async function saveGoogleDriveCredentials(
    data: SaveGoogleDriveCredentialsRequest
): Promise<SaveGoogleDriveCredentialsResponse> {
    const validatedData = SaveGoogleDriveCredentialsRequestSchema.parse(data)
    const response = await apiClient.post<SaveGoogleDriveCredentialsResponse>(
        '/storage/gdrive/credentials',
        validatedData
    )
    return SaveGoogleDriveCredentialsResponseSchema.parse(response.data)
}

/**
 * Step 2: Initiate Google OAuth consent flow using saved credentials
 * POST /api/storage/gdrive/{profileId}/authenticate
 *
 * @returns Authorization URL to redirect the user to Google consent screen
 */
export async function authenticateGoogleDrive(
    profileId: number
): Promise<GoogleDriveAuthResponse> {
    const response = await apiClient.post<GoogleDriveAuthResponse>(
        `/storage/gdrive/${profileId}/authenticate`
    )
    return GoogleDriveAuthResponseSchema.parse(response.data)
}

/**
 * Re-authenticate a Google Drive profile when refresh token has expired
 * POST /api/storage/gdrive/{profileId}/reauthenticate
 *
 * Same flow as authenticate — no need to re-enter credentials.
 */
export async function reauthenticateGoogleDrive(
    profileId: number
): Promise<GoogleDriveAuthResponse> {
    const response = await apiClient.post<GoogleDriveAuthResponse>(
        `/storage/gdrive/${profileId}/reauthenticate`
    )
    return GoogleDriveAuthResponseSchema.parse(response.data)
}

/**
 * Storage profile result from S3 configuration
 */
interface S3ConfigureResult {
    success: boolean
    storageProfileId: number
    message: string
}

/**
 * Configure S3-compatible storage with user-provided credentials
 * POST /api/storage/configure-s3
 *
 * Supports AWS S3, Backblaze B2, Cloudflare R2, and other S3-compatible providers
 *
 * @param config - S3 credentials and bucket configuration
 * @returns Storage profile ID on success
 */
export async function configureS3(config: ConfigureS3Request): Promise<S3ConfigureResult> {
    // Validate request before sending
    const validatedConfig = ConfigureS3RequestSchema.parse(config)

    const response = await apiClient.post<S3ConfigureResult>(
        '/storage/s3/configure',
        validatedConfig
    )
    return response.data
}

/**
 * Get all storage profiles for the current user
 */
export async function getStorageProfiles(): Promise<StorageProfile[]> {
    const response = await apiClient.get<StorageProfile[]>('/storage/profiles')
    return StorageProfilesArraySchema.parse(response.data)
}

/**
 * Get a single storage profile by ID
 */
export async function getStorageProfile(id: number): Promise<StorageProfileDetail> {
    const response = await apiClient.get<StorageProfileDetail>(`/storage/profiles/${id}`)
    return StorageProfileDetailSchema.parse(response.data)
}

/**
 * Set a storage profile as the default
 */
export async function setDefaultStorageProfile(id: number): Promise<void> {
    await apiClient.post(`/storage/profiles/${id}/set-default`)
}

/**
 * Disconnect a storage profile (sets IsActive = false)
 */
export async function disconnectStorageProfile(id: number): Promise<void> {
    await apiClient.post(`/storage/profiles/${id}/disconnect`)
}

/**
 * Opens Google OAuth authorization URL in a popup window.
 * Polls for the redirect back to /storage with success/error params.
 * Reusable for both authenticate and reauthenticate flows.
 *
 * @param authorizationUrl - The Google OAuth consent URL
 * @returns Promise that resolves with the profile ID on success
 */
export function openGoogleDriveAuthPopup(authorizationUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
        // Open popup window
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            authorizationUrl,
            'Google Drive Authorization',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        )

        if (!popup) {
            reject(new Error('POPUP_BLOCKED'))
            return
        }

        // Poll for popup to close (user cancelled)
        const pollTimer = setInterval(() => {
            if (popup.closed) {
                clearInterval(pollTimer)
                clearInterval(checkCallback)
                reject(new Error('AUTHORIZATION_CANCELLED'))
            }
        }, 1000)

        // Poll for redirect to /storage page
        const checkCallback = setInterval(() => {
            try {
                const popupUrl = popup.location.href

                if (popupUrl.includes('/storage') && !popupUrl.includes('google') && !popupUrl.includes('accounts.google.com')) {
                    clearInterval(checkCallback)
                    clearInterval(pollTimer)

                    const url = new URL(popupUrl)
                    const success = url.searchParams.get('success')
                    const profileId = url.searchParams.get('profileId')
                    const error = url.searchParams.get('error')
                    const message = url.searchParams.get('message')

                    popup.close()

                    if (success === 'true' && profileId) {
                        resolve(parseInt(profileId, 10))
                    } else if (error) {
                        reject(new Error(error))
                    } else if (message) {
                        reject(new Error(message))
                    } else {
                        reject(new Error('Unknown error during OAuth'))
                    }
                }
            } catch {
                // Cross-origin error - popup is still on Google's domain
            }
        }, 500)

        // Timeout after 5 minutes
        setTimeout(() => {
            if (!popup.closed) {
                popup.close()
            }
            clearInterval(checkCallback)
            clearInterval(pollTimer)
            reject(new Error('AUTHORIZATION_TIMEOUT'))
        }, 5 * 60 * 1000)
    })
}
