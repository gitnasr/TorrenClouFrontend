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
    Support = "Support"
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
    PROCESSING = "PROCESSING",
    UPLOADING = "UPLOADING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}

export enum JobType {
    Torrent = "Torrent",
    Other = "Other"
}

export enum ViolationType {
    Spam = "Spam",
    Abuse = "Abuse",
    TermsViolation = "TermsViolation",
    CopyrightInfringement = "CopyrightInfringement",
    Other = "Other"
}
