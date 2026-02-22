import { StorageProviderType } from '@/types/enums'

export interface StorageProviderConfigItem {
    label: string
    color: string
    url: string
}

export const storageProviderConfig: Record<StorageProviderType, StorageProviderConfigItem> = {
    [StorageProviderType.GoogleDrive]: { 
        label: 'Google Drive', 
        color: 'text-primary', 
        url: 'https://drive.google.com' 
    },
    [StorageProviderType.Dropbox]: { 
        label: 'Dropbox', 
        color: 'text-warning', 
        url: 'https://www.dropbox.com' 
    },
    [StorageProviderType.OneDrive]: { 
        label: 'OneDrive', 
        color: 'text-info', 
        url: 'https://onedrive.live.com' 
    },
    [StorageProviderType.S3]: { 
        label: 'AWS S3', 
        color: 'text-danger', 
        url: 'https://s3.console.aws.amazon.com' 
    },
}

export function getStorageProviderConfig(providerType: StorageProviderType): StorageProviderConfigItem {
    return storageProviderConfig[providerType] || storageProviderConfig[StorageProviderType.GoogleDrive]
}



