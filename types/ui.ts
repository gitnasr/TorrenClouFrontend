export interface StatusIndicatorProps {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired'
    label?: string
    showDot?: boolean
    className?: string
}

export interface FileUploadProps {
    accept?: string
    maxSize?: number // in bytes
    onFileSelect: (file: File | null) => void
    selectedFile?: File | null
    error?: string
    className?: string
    disabled?: boolean
}
