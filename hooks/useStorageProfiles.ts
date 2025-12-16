'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
    getStorageProfiles,
    getStorageProfile,
    setDefaultStorageProfile,
    disconnectStorageProfile,
    connectGoogleDriveWithPopup,
} from '@/lib/api/storage'
import { getStorageErrorMessage } from '@/types/storage'
import type { StorageProfile } from '@/types/storage'
import { useStorageProfilesStore } from '@/stores/storageProfilesStore'
import { toast } from 'sonner'

// ============================================
// Query Keys
// ============================================

export const storageProfileKeys = {
    all: ['storage-profiles'] as const,
    lists: () => [...storageProfileKeys.all, 'list'] as const,
    list: () => [...storageProfileKeys.lists()] as const,
    details: () => [...storageProfileKeys.all, 'detail'] as const,
    detail: (id: number) => [...storageProfileKeys.details(), id] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch all storage profiles for the current user
 */
export function useStorageProfiles() {
    const { status } = useSession()

    return useQuery({
        queryKey: storageProfileKeys.list(),
        queryFn: getStorageProfiles,
        enabled: status === 'authenticated',
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to fetch a specific storage profile by ID
 */
export function useStorageProfile(profileId: number) {
    const { status } = useSession()

    return useQuery({
        queryKey: storageProfileKeys.detail(profileId),
        queryFn: () => getStorageProfile(profileId),
        enabled: status === 'authenticated' && !!profileId,
    })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook to connect Google Drive via OAuth popup
 */
export function useConnectGoogleDrive() {
    const queryClient = useQueryClient()
    const {
        setConnecting,
        setConnectionError,
        closeConnectModal,
        resetProfileName
    } = useStorageProfilesStore()

    return useMutation({
        mutationFn: (profileName?: string) => connectGoogleDriveWithPopup(profileName),

        onMutate: () => {
            setConnecting(true)
        },

        onSuccess: (profileId) => {
            setConnecting(false)
            // Invalidate and refetch profiles list
            queryClient.invalidateQueries({ queryKey: storageProfileKeys.list() })
            // Prefetch the new profile
            queryClient.invalidateQueries({ queryKey: storageProfileKeys.detail(profileId) })
            // Close modal and reset form
            closeConnectModal()
            resetProfileName()
            toast.success('Google Drive connected successfully!')
        },

        onError: (error: Error) => {
            const errorMessage = getStorageErrorMessage(error.message, error.message)
            setConnectionError(errorMessage)
            toast.error('Connection Failed', { description: errorMessage })
        },
    })
}

/**
 * Hook to set a storage profile as default
 */
export function useSetDefaultProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: setDefaultStorageProfile,

        // Optimistic update
        onMutate: async (profileId: number) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: storageProfileKeys.list() })

            // Snapshot previous value
            const previousProfiles = queryClient.getQueryData<StorageProfile[]>(
                storageProfileKeys.list()
            )

            // Optimistically update
            queryClient.setQueryData<StorageProfile[]>(
                storageProfileKeys.list(),
                (old) =>
                    old?.map((p) => ({
                        ...p,
                        isDefault: p.id === profileId,
                    })) ?? []
            )

            return { previousProfiles }
        },

        // Rollback on error
        onError: (error, _profileId, context) => {
            if (context?.previousProfiles) {
                queryClient.setQueryData(
                    storageProfileKeys.list(),
                    context.previousProfiles
                )
            }
            toast.error('Failed to set default profile', {
                description: error instanceof Error ? error.message : 'Unknown error',
            })
        },

        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: storageProfileKeys.list() })
        },

        onSuccess: () => {
            toast.success('Default profile updated')
        },
    })
}

/**
 * Hook to disconnect a storage profile
 */
export function useDisconnectProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: disconnectStorageProfile,

        // Optimistic update
        onMutate: async (profileId: number) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: storageProfileKeys.list() })

            // Snapshot previous value
            const previousProfiles = queryClient.getQueryData<StorageProfile[]>(
                storageProfileKeys.list()
            )

            // Optimistically update isActive to false
            queryClient.setQueryData<StorageProfile[]>(
                storageProfileKeys.list(),
                (old) => old?.map((p) =>
                    p.id === profileId ? { ...p, isActive: false, isDefault: false } : p
                ) ?? []
            )

            return { previousProfiles }
        },

        // Rollback on error
        onError: (error, _profileId, context) => {
            if (context?.previousProfiles) {
                queryClient.setQueryData(
                    storageProfileKeys.list(),
                    context.previousProfiles
                )
            }
            toast.error('Failed to disconnect profile', {
                description: error instanceof Error ? error.message : 'Unknown error',
            })
        },

        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: storageProfileKeys.list() })
        },

        onSuccess: () => {
            toast.success('Storage profile disconnected')
        },
    })
}

