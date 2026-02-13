// Zustand store for Storage Profiles UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StorageProfilesUIState {
    // Connect Modal state
    isConnectModalOpen: boolean
    openConnectModal: () => void
    closeConnectModal: () => void

    // Profile name input state
    profileName: string
    setProfileName: (name: string) => void
    resetProfileName: () => void

    // OAuth connection state
    isConnecting: boolean
    connectionError: string | null
    setConnecting: (isConnecting: boolean) => void
    setConnectionError: (error: string | null) => void

    // Credential selection for connect flow
    selectedCredentialId: number | null
    setSelectedCredentialId: (id: number | null) => void

    // Credentials form visibility
    isCredentialsFormOpen: boolean
    setCredentialsFormOpen: (open: boolean) => void

    // Selected profile for details view
    selectedProfileId: number | null
    setSelectedProfileId: (id: number | null) => void

    // Reset all state
    reset: () => void
}

export const useStorageProfilesStore = create<StorageProfilesUIState>()(
    devtools(
        (set) => ({
            // Connect Modal state
            isConnectModalOpen: false,
            openConnectModal: () => set({ isConnectModalOpen: true }),
            closeConnectModal: () => set({
                isConnectModalOpen: false,
                profileName: '',
                connectionError: null,
                selectedCredentialId: null,
            }),

            // Profile name state
            profileName: '',
            setProfileName: (name: string) => set({ profileName: name }),
            resetProfileName: () => set({ profileName: '' }),

            // OAuth connection state
            isConnecting: false,
            connectionError: null,
            setConnecting: (isConnecting) => set({ isConnecting, connectionError: null }),
            setConnectionError: (error) => set({ connectionError: error, isConnecting: false }),

            // Credential selection
            selectedCredentialId: null,
            setSelectedCredentialId: (id: number | null) => set({ selectedCredentialId: id }),

            // Credentials form
            isCredentialsFormOpen: false,
            setCredentialsFormOpen: (open: boolean) => set({ isCredentialsFormOpen: open }),

            // Selected profile
            selectedProfileId: null,
            setSelectedProfileId: (id: number | null) => set({ selectedProfileId: id }),

            // Reset all
            reset: () => set({
                isConnectModalOpen: false,
                profileName: '',
                isConnecting: false,
                connectionError: null,
                selectedCredentialId: null,
                isCredentialsFormOpen: false,
                selectedProfileId: null,
            }),
        }),
        { name: 'StorageProfilesStore' }
    )
)

// Selectors for optimized re-renders
export const selectIsConnectModalOpen = (state: StorageProfilesUIState) => state.isConnectModalOpen
export const selectProfileName = (state: StorageProfilesUIState) => state.profileName
export const selectIsConnecting = (state: StorageProfilesUIState) => state.isConnecting
export const selectConnectionError = (state: StorageProfilesUIState) => state.connectionError
export const selectSelectedCredentialId = (state: StorageProfilesUIState) => state.selectedCredentialId
export const selectIsCredentialsFormOpen = (state: StorageProfilesUIState) => state.isCredentialsFormOpen
export const selectSelectedProfileId = (state: StorageProfilesUIState) => state.selectedProfileId
