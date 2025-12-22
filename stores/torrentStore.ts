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
    selectedFilePaths: string[]
    selectedStorageProfileId: number | null

    // Actions
    setAnalysisResult: (result: TorrentInfo) => void
    setTorrentFile: (file: File | null) => void
    setQuoteResult: (result: QuoteResponse | null) => void
    setSelectedFilePaths: (paths: string[]) => void
    toggleFileSelection: (path: string) => void
    selectAllFiles: () => void
    deselectAllFiles: () => void
    setSelectedStorageProfileId: (id: number | null) => void
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
            selectedFilePaths: [],
            selectedStorageProfileId: null,

            // Actions
            setAnalysisResult: (result) =>
                set(
                    {
                        analysisResult: result,
                        // Auto-select all files when analysis completes
                        selectedFilePaths: result.files.map((f) => f.path),
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

            setSelectedFilePaths: (paths) =>
                set({ selectedFilePaths: paths }, false, 'setSelectedFilePaths'),

            toggleFileSelection: (path) =>
                set(
                    (state) => ({
                        selectedFilePaths: state.selectedFilePaths.includes(path)
                            ? state.selectedFilePaths.filter((p) => p !== path)
                            : [...state.selectedFilePaths, path],
                        // Clear quote when selection changes
                        quoteResult: null,
                    }),
                    false,
                    'toggleFileSelection'
                ),

            selectAllFiles: () =>
                set(
                    (state) => ({
                        selectedFilePaths:
                            state.analysisResult?.files.map((f) => f.path) ?? [],
                        quoteResult: null,
                    }),
                    false,
                    'selectAllFiles'
                ),

            deselectAllFiles: () =>
                set(
                    { selectedFilePaths: [], quoteResult: null },
                    false,
                    'deselectAllFiles'
                ),

            setSelectedStorageProfileId: (id) =>
                set({ selectedStorageProfileId: id }, false, 'setSelectedStorageProfileId'),

            clearTorrentData: () =>
                set(
                    {
                        analysisResult: null,
                        torrentFile: null,
                        quoteResult: null,
                        selectedFilePaths: [],
                        selectedStorageProfileId: null,
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
export const selectSelectedFilePaths = (state: TorrentStore) => state.selectedFilePaths
export const selectSelectedStorageProfileId = (state: TorrentStore) => state.selectedStorageProfileId

// Computed selectors
export const selectSelectedFilesSize = (state: TorrentStore) => {
    if (!state.analysisResult) return 0
    return state.analysisResult.files
        .filter((f) => state.selectedFilePaths.includes(f.path))
        .reduce((acc, f) => acc + f.size, 0)
}

export const selectHasQuote = (state: TorrentStore) => state.quoteResult !== null

