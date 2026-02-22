// Zod validation schemas for forms
import { z } from 'zod'

/**
 * Storage profile name validation
 */
export const storageProfileSchema = z.object({
    profileName: z
        .string()
        .min(1, 'Profile name is required')
        .max(100, 'Profile name cannot exceed 100 characters'),
})

export type StorageProfileData = z.infer<typeof storageProfileSchema>

/**
 * File selection validation (for torrent file selection)
 */
export const fileSelectionSchema = z.object({
    selectedIndices: z
        .array(z.number())
        .min(1, 'Please select at least one file'),
})

export type FileSelectionData = z.infer<typeof fileSelectionSchema>

/**
 * Login/auth validation (if needed)
 */
export const loginSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address'),
})

export type LoginData = z.infer<typeof loginSchema>

/**
 * Date range filter validation
 */
export const dateRangeSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return data.startDate <= data.endDate
        }
        return true
    },
    {
        message: 'Start date must be before or equal to end date',
        path: ['endDate'],
    }
)

export type DateRangeData = z.infer<typeof dateRangeSchema>
