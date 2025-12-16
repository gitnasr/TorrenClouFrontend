// Zod validation schemas for forms
import { z } from 'zod'

/**
 * Deposit form validation schema
 */
export const depositFormSchema = z.object({
    amount: z
        .number()
        .min(1, 'Amount must be at least 1')
        .max(10000, 'Amount cannot exceed 10,000'),
    currency: z
        .string()
        .min(1, 'Please select a currency'),
})

export type DepositFormData = z.infer<typeof depositFormSchema>

/**
 * Voucher input validation schema
 */
export const voucherFormSchema = z.object({
    code: z
        .string()
        .min(3, 'Voucher code must be at least 3 characters')
        .max(50, 'Voucher code cannot exceed 50 characters')
        .regex(/^[A-Za-z0-9-_]+$/, 'Voucher code can only contain letters, numbers, hyphens, and underscores'),
})

export type VoucherFormData = z.infer<typeof voucherFormSchema>

/**
 * Balance adjustment form validation (admin)
 */
export const balanceAdjustmentSchema = z.object({
    amount: z
        .number()
        .refine((val) => val !== 0, 'Amount cannot be zero'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters'),
})

export type BalanceAdjustmentData = z.infer<typeof balanceAdjustmentSchema>

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
 * Date range filter validation (admin)
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
