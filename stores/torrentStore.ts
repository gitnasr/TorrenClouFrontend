// Zustand store for Torrent workflow state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { TorrentAnalysisResponse } from '@/types/torrents'

interface TorrentStore {
    // Analysis state
    analysisResult: TorrentAnalysisResponse | null
    torrentFile: File | null

    // Selection state
    selectedFilePaths: string[]
    selectedStorageProfileId: number | null

    // Actions
    setAnalysisResult: (result: TorrentAnalysisResponse) => void
    setTorrentFile: (file: File | null) => void
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
            selectedFilePaths: [],
            selectedStorageProfileId: null,

            // Actions
            setAnalysisResult: (result) =>
                set(
                    {
                        analysisResult: result,
                        // Auto-select all files when analysis completes
                        selectedFilePaths: result.files.map((f) => f.path),
                    },
                    false,
                    'setAnalysisResult'
                ),

            setTorrentFile: (file) =>
                set({ torrentFile: file }, false, 'setTorrentFile'),

            setSelectedFilePaths: (paths) =>
                set({ selectedFilePaths: paths }, false, 'setSelectedFilePaths'),

            toggleFileSelection: (path) =>
                set(
                    (state) => ({
                        selectedFilePaths: state.selectedFilePaths.includes(path)
                            ? state.selectedFilePaths.filter((p) => p !== path)
                            : [...state.selectedFilePaths, path],
                    }),
                    false,
                    'toggleFileSelection'
                ),

            selectAllFiles: () =>
                set(
                    (state) => ({
                        selectedFilePaths:
                            state.analysisResult?.files.map((f) => f.path) ?? [],
                    }),
                    false,
                    'selectAllFiles'
                ),

            deselectAllFiles: () =>
                set(
                    { selectedFilePaths: [] },
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
export const selectSelectedFilePaths = (state: TorrentStore) => state.selectedFilePaths
export const selectSelectedStorageProfileId = (state: TorrentStore) => state.selectedStorageProfileId

// Computed selectors
export const selectSelectedFilesSize = (state: TorrentStore) => {
    if (!state.analysisResult) return 0
    return state.analysisResult.files
        .filter((f) => state.selectedFilePaths.includes(f.path))
        .reduce((acc, f) => acc + f.size, 0)
}

