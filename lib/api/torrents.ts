// Torrent API client with Zod validation
import apiClient from '../axios'
import {
    torrentInfoSchema,
    quoteResponseSchema,
    type TorrentInfo,
    type QuoteResponse,
} from '@/types/torrents'

// Re-export types for convenience
export type { TorrentInfo, QuoteResponse }
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
 * @param selectedFileIndices - Array of file indices to download
 * @param voucherCode - Optional voucher code for discount
 * @returns Quote with pricing details and invoice ID
 */
export async function getTorrentQuote(
    torrentFile: File,
    selectedFileIndices: number[],
    voucherCode?: string
): Promise<QuoteResponse> {
    const formData = new FormData()
    formData.append('torrentFile', torrentFile)

    // Append each index separately for proper array handling
    selectedFileIndices.forEach(index => {
        formData.append('selectedFileIndices', index.toString())
    })

    if (voucherCode) {
        formData.append('voucherCode', voucherCode)
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
