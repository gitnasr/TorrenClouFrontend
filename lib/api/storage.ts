// Storage API client with Zod validation
import apiClient from '../axios'
import {
    StorageProfileSchema,
    StorageProfileDetailSchema,
    StorageProfilesArraySchema,
    GoogleDriveConnectResponseSchema,
} from '@/types/storage'
import type {
    StorageProfile,
    StorageProfileDetail,
    GoogleDriveConnectResponse,
} from '@/types/storage'

// Re-export types for convenience
export type { StorageProfile, StorageProfileDetail, GoogleDriveConnectResponse }
export { getStorageErrorMessage, storageErrorMessages } from '@/types/storage'

/**
 * Get Google OAuth authorization URL
 * @param profileName Optional custom name for this storage connection (3-50 characters)
 */
export async function getGoogleDriveAuthUrl(profileName?: string): Promise<GoogleDriveConnectResponse> {
    const url = profileName
        ? `/storage/gdrive/connect?profileName=${encodeURIComponent(profileName)}`
        : '/storage/gdrive/connect'

    const response = await apiClient.get<GoogleDriveConnectResponse>(url)
    return GoogleDriveConnectResponseSchema.parse(response.data)
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
 * Opens Google OAuth in a popup window
 * Backend will redirect to /storage?success=true&profileId=123 or /storage?error=...&message=...
 * The popup detects this redirect and closes itself
 * @param profileName Optional custom name for this storage connection
 * @returns Promise that resolves with the profile ID on success
 */
export function connectGoogleDriveWithPopup(profileName?: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            // Get authorization URL with optional profile name
            const { authorizationUrl } = await getGoogleDriveAuthUrl(profileName)

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
                    // Check if popup is on our /storage page (after backend redirect)
                    const popupUrl = popup.location.href

                    // Check if we've been redirected back to the storage page
                    if (popupUrl.includes('/storage') && !popupUrl.includes('google') && !popupUrl.includes('accounts.google.com')) {
                        clearInterval(checkCallback)
                        clearInterval(pollTimer)

                        // Extract query params
                        const url = new URL(popupUrl)
                        const success = url.searchParams.get('success')
                        const profileId = url.searchParams.get('profileId')
                        const error = url.searchParams.get('error')
                        const message = url.searchParams.get('message')

                        // Close popup
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
                    // This is expected, continue polling
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
        } catch (error) {
            reject(error)
        }
    })
}
