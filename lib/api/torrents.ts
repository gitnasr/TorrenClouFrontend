// Torrent API client with Zod validation
import apiClient from '../axios'
import {
    torrentAnalysisResponseSchema,
    jobCreationResultSchema,
    type TorrentAnalysisResponse,
    type JobCreationResult,
} from '@/types/torrents'

// Re-export types for convenience
export type { TorrentAnalysisResponse, JobCreationResult }
export { getTorrentErrorMessage, torrentErrorMessages } from '@/types/torrents'

/**
 * Analyze a torrent file
 * POST /api/torrents/analyze
 * 
 * Uploads a .torrent file and returns metadata including file list,
 * health info, and a torrentFileId for use in job creation.
 * 
 * @param file - The .torrent file to analyze
 * @returns Torrent analysis response with files, health, and torrentFileId
 */
export async function analyzeTorrentFile(file: File): Promise<TorrentAnalysisResponse> {
    const formData = new FormData()
    formData.append('TorrentFile', file)

    const response = await apiClient.post<TorrentAnalysisResponse>(
        '/torrents/analyze',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return torrentAnalysisResponseSchema.parse(response.data)
}

/**
 * Create a download job from an analyzed torrent
 * POST /api/torrents/create-job (authenticated)
 * 
 * @param torrentFileId - The torrent file ID from analyze response
 * @param selectedFilePaths - Array of file paths to download (null = all files)
 * @param storageProfileId - Storage profile ID (required)
 * @returns Job creation result with job ID
 */
export async function createJob(
    torrentFileId: number,
    selectedFilePaths: string[] | null,
    storageProfileId: number
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
