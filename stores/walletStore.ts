// Zustand store for Wallet UI state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { toast } from 'sonner'

interface WalletUIState {
    // Clipboard copy feedback state
    copied: boolean
    setCopied: (copied: boolean) => void
    copyToClipboard: (text: string) => Promise<void>

    // Reset all state
    reset: () => void
}

export const useWalletStore = create<WalletUIState>()(
    devtools(
        (set) => ({
            // Clipboard state
            copied: false,
            setCopied: (copied) => set({ copied }),
            copyToClipboard: async (text: string) => {
                try {
                    await navigator.clipboard.writeText(text)
                    set({ copied: true })
                    toast.success('Copied to clipboard')
                    // Reset copied state after 2 seconds
                    setTimeout(() => set({ copied: false }), 2000)
                } catch (error) {
                    toast.error('Failed to copy to clipboard')
                }
            },

            // Reset all
            reset: () => set({
                copied: false,
            }),
        }),
        { name: 'WalletStore' }
    )
)

// Selectors for optimized re-renders
export const selectCopied = (state: WalletUIState) => state.copied

