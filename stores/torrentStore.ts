// Zustand store for Torrent workflow state
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { TorrentInfo, QuoteResponse } from '@/types/torrents'

interface TorrentStore {
    // Analysis state
    analysisResult: TorrentInfo | null
    torrentFile: File | null

    // Quote state
    quoteResult: QuoteResponse | null

    // Selection state
    selectedFileIndices: number[]

    // Actions
    setAnalysisResult: (result: TorrentInfo) => void
    setTorrentFile: (file: File | null) => void
    setQuoteResult: (result: QuoteResponse | null) => void
    setSelectedFileIndices: (indices: number[]) => void
    toggleFileSelection: (index: number) => void
    selectAllFiles: () => void
    deselectAllFiles: () => void
    clearTorrentData: () => void
}

export const useTorrentStore = create<TorrentStore>()(
    devtools(
        // Note: We don't persist File objects as they can't be serialized
        (set, get) => ({
            // Initial state
            analysisResult: null,
            torrentFile: null,
            quoteResult: null,
            selectedFileIndices: [],

            // Actions
            setAnalysisResult: (result) =>
                set(
                    {
                        analysisResult: result,
                        // Auto-select all files when analysis completes
                        selectedFileIndices: result.files.map((f) => f.index),
                        // Clear any previous quote when new analysis is done
                        quoteResult: null,
                    },
                    false,
                    'setAnalysisResult'
                ),

            setTorrentFile: (file) =>
                set({ torrentFile: file }, false, 'setTorrentFile'),

            setQuoteResult: (result) =>
                set({ quoteResult: result }, false, 'setQuoteResult'),

            setSelectedFileIndices: (indices) =>
                set({ selectedFileIndices: indices }, false, 'setSelectedFileIndices'),

            toggleFileSelection: (index) =>
                set(
                    (state) => ({
                        selectedFileIndices: state.selectedFileIndices.includes(index)
                            ? state.selectedFileIndices.filter((i) => i !== index)
                            : [...state.selectedFileIndices, index],
                        // Clear quote when selection changes
                        quoteResult: null,
                    }),
                    false,
                    'toggleFileSelection'
                ),

            selectAllFiles: () =>
                set(
                    (state) => ({
                        selectedFileIndices:
                            state.analysisResult?.files.map((f) => f.index) ?? [],
                        quoteResult: null,
                    }),
                    false,
                    'selectAllFiles'
                ),

            deselectAllFiles: () =>
                set(
                    { selectedFileIndices: [], quoteResult: null },
                    false,
                    'deselectAllFiles'
                ),

            clearTorrentData: () =>
                set(
                    {
                        analysisResult: null,
                        torrentFile: null,
                        quoteResult: null,
                        selectedFileIndices: [],
                    },
                    false,
                    'clearTorrentData'
                ),
        }),
        { name: 'TorrentStore' }
    )
)

// Selectors for optimized re-renders
export const selectAnalysisResult = (state: TorrentStore) => state.analysisResult
export const selectTorrentFile = (state: TorrentStore) => state.torrentFile
export const selectQuoteResult = (state: TorrentStore) => state.quoteResult
export const selectSelectedFileIndices = (state: TorrentStore) => state.selectedFileIndices

// Computed selectors
export const selectSelectedFilesSize = (state: TorrentStore) => {
    if (!state.analysisResult) return 0
    return state.analysisResult.files
        .filter((f) => state.selectedFileIndices.includes(f.index))
        .reduce((acc, f) => acc + f.size, 0)
}

export const selectHasQuote = (state: TorrentStore) => state.quoteResult !== null
