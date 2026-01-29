// Enums matching backend DTOs

export enum StorageProviderType {
    GoogleDrive = "GoogleDrive",
    OneDrive = "OneDrive",
    AwsS3 = "AwsS3",
    Dropbox = "Dropbox"
}

export enum FileStatus {
    PENDING = "PENDING",
    DOWNLOADING = "DOWNLOADING",
    READY = "READY",
    CORRUPTED = "CORRUPTED",
    DELETED = "DELETED"
}

export enum JobStatus {
    QUEUED = "QUEUED",
    DOWNLOADING = "DOWNLOADING",
    PENDING_UPLOAD = "PENDING_UPLOAD",
    UPLOADING = "UPLOADING",
    TORRENT_DOWNLOAD_RETRY = "TORRENT_DOWNLOAD_RETRY",
    UPLOAD_RETRY = "UPLOAD_RETRY",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    TORRENT_FAILED = "TORRENT_FAILED",
    UPLOAD_FAILED = "UPLOAD_FAILED",
    GOOGLE_DRIVE_FAILED = "GOOGLE_DRIVE_FAILED"
}

export enum JobType {
    Torrent = "Torrent"
}
