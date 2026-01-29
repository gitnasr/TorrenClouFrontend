// Torrent API client with Zod validation
import apiClient from '../axios'
import {
    torrentInfoSchema,
    quoteResponseSchema,
    jobCreationResultSchema,
    type TorrentInfo,
    type QuoteResponse,
    type JobCreationResult,
} from '@/types/torrents'

// Re-export types for convenience
export type { TorrentInfo, QuoteResponse, JobCreationResult }
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
 * Get a quote for downloading selected files from a torrent
 * POST /api/torrents/quote (authenticated)
 * 
 * @param torrentFile - The .torrent file
 * @param selectedFilePaths - Array of file paths to download (null = all files)
 * @param storageProfileId - ID of the storage profile to use for upload
 * @returns Quote with torrent metadata and torrentFileId for job creation
 */
export async function getTorrentQuote(
    torrentFile: File,
    selectedFilePaths: string[] | null,
    storageProfileId: number
): Promise<QuoteResponse> {
    const formData = new FormData()
    formData.append('torrentFile', torrentFile)
    formData.append('storageProfileId', storageProfileId.toString())

    // Append each path separately for proper array handling (null = all files)
    if (selectedFilePaths) {
        selectedFilePaths.forEach(path => {
            formData.append('selectedFilePaths', path)
        })
    }

    const response = await apiClient.post<QuoteResponse>(
        '/torrents/quote',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return quoteResponseSchema.parse(response.data)
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
