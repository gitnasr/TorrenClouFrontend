// Torrent API client with Zod validation
import apiClient from '../axios'
import {
    torrentInfoSchema,
    analyzeResponseSchema,
    jobCreationResultSchema,
    type TorrentInfo,
    type AnalyzeResponse,
    type JobCreationResult,
} from '@/types/torrents'

// Re-export types for convenience
export type { TorrentInfo, AnalyzeResponse, JobCreationResult }
export { getTorrentErrorMessage, torrentErrorMessages } from '@/types/torrents'

/**
 * Analyze a torrent file
 * POST /api/torrents/analyze/file (public endpoint)
 * 
 * @param file - The .torrent file to analyze
 * @returns Torrent information including files, trackers, and health data
 */
export async function analyzeTorrentFile(file: File): Promise<TorrentInfo> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<TorrentInfo>(
        '/torrents/analyze/file',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return torrentInfoSchema.parse(response.data)
}

/**
 * Analyze selected files from a torrent for job creation
 * POST /api/torrents/analyze (authenticated)
 *
 * @param torrentFile - The .torrent file
 * @param selectedFilePaths - Array of file paths to download (null = all files)
 * @param storageProfileId - ID of the storage profile to use for upload
 * @returns Analysis result with torrent metadata and torrentFileId for job creation
 */
export async function getTorrentAnalysis(
    torrentFile: File,
    selectedFilePaths: string[] | null,
    storageProfileId: number
): Promise<AnalyzeResponse> {
    const formData = new FormData()
    formData.append('torrentFile', torrentFile)
    formData.append('storageProfileId', storageProfileId.toString())

    // Append each path separately for proper array handling (null = all files)
    if (selectedFilePaths) {
        selectedFilePaths.forEach(path => {
            formData.append('selectedFilePaths', path)
        })
    }

    const response = await apiClient.post<AnalyzeResponse>(
        '/torrents/analyze',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return analyzeResponseSchema.parse(response.data)
}

/**
 * Create a job directly from a quote
 * POST /api/torrents/create-job (authenticated)
 * 
 * @param torrentFileId - The torrent file ID from quote response
 * @param selectedFilePaths - Array of file paths to download (null = all files)
 * @param storageProfileId - Optional storage profile ID
 * @returns Job creation result with job ID
 */
export async function createJob(
    torrentFileId: number,
    selectedFilePaths: string[] | null,
    storageProfileId?: number
): Promise<JobCreationResult> {
    const response = await apiClient.post<JobCreationResult>(
        '/torrents/create-job',
        {
            torrentFileId,
            selectedFilePaths,
            storageProfileId,
        }
    )

    return jobCreationResultSchema.parse(response.data)
}
