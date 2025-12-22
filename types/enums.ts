// Enums matching backend DTOs

export enum RegionCode {
    Global = "Global",
    US = "US",
    EU = "EU",
    EG = "EG",
    SA = "SA",
    IN = "IN"
}

export enum UserRole {
    User = "User",
    Admin = "Admin",
    Support = "Support",
    Suspended = "Suspended",
    Banned = "Banned"
}

export enum StorageProviderType {
    GoogleDrive = "GoogleDrive",
    OneDrive = "OneDrive",
    AwsS3 = "AwsS3",
    Dropbox = "Dropbox"
}

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
    ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
    BONUS = "BONUS",
    DEDUCTION = "DEDUCTION"
}

export enum FileStatus {
    PENDING = "PENDING",
    DOWNLOADING = "DOWNLOADING",
    READY = "READY",
    CORRUPTED = "CORRUPTED",
    DELETED = "DELETED"
}

export enum DiscountType {
    Percentage = "Percentage",
    FixedAmount = "FixedAmount"
}

export enum DepositStatus {
    Pending = "Pending",
    Completed = "Completed",
    Failed = "Failed",
    Expired = "Expired"
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

/**
 * Sync job status - separate from JobStatus.
 * Used for admin sync jobs tracking.
 */
export enum SyncStatus {
    NOT_STARTED = "NotStarted",
    SYNCING = "SYNCING",
    SYNC_RETRY = "SYNC_RETRY",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum JobType {
    Torrent = "Torrent",
    /** @internal Admin-only: Internal system sync jobs */
    Sync = "Sync"
}

export enum ViolationType {
    Spam = "Spam",
    Abuse = "Abuse",
    TermsViolation = "TermsViolation",
    CopyrightInfringement = "CopyrightInfringement",
    Other = "Other"
}
