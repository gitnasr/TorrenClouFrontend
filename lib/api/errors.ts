// Shared API error extraction utility
// Handles all backend error response formats:
// 1. Standard v2: { code: string, message: string }
// 2. ASP.NET model validation: { errors: { FieldName: ["msg1", ...] } }
// 3. Legacy: { isSuccess: false, error: { code: string, message: string } }

import { AxiosError } from 'axios'

export interface ExtractedError {
    code: string | null
    message: string
    fieldErrors?: Record<string, string[]>
}

/**
 * Extract a structured error from an unknown error (typically an AxiosError).
 * Supports all backend error response formats.
 */
export function extractApiError(error: unknown): ExtractedError {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data

        // Format 2: ASP.NET model validation ({ errors: { FieldName: [...] } })
        if (data.errors && typeof data.errors === 'object' && !data.code) {
            const fieldErrors = data.errors as Record<string, string[]>
            const messages = Object.values(fieldErrors).flat()
            return {
                code: null,
                message: messages.join('. ') || data.title || 'Validation failed',
                fieldErrors,
            }
        }

        // Format 1: Standard v2 ({ code, message })
        if (data.code && data.message) {
            return {
                code: data.code,
                message: data.message,
            }
        }

        // Format 3: Legacy ({ isSuccess, error: { code, message } })
        if (data.error?.code) {
            return {
                code: data.error.code,
                message: data.error.message || 'An unexpected error occurred',
            }
        }

        // Fallback: data has a message string
        if (data.message) {
            return {
                code: null,
                message: data.message,
            }
        }
    }

    if (error instanceof Error) {
        return {
            code: error.message,
            message: error.message,
        }
    }

    return {
        code: null,
        message: 'An unexpected error occurred',
    }
}
