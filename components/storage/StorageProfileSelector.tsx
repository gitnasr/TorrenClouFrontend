'use client'

import { useTorrentStore } from '@/stores/torrentStore'
import { useStorageProfiles } from '@/hooks/useStorageProfiles'
import { StorageProviderType } from '@/types/enums'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Loader2, HardDrive, Cloud, AlertCircle, ChevronDown, Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

// Provider icons mapping
const providerIcons: Record<StorageProviderType, React.ReactNode> = {
    [StorageProviderType.GoogleDrive]: <Cloud className="h-4 w-4" />,
    [StorageProviderType.OneDrive]: <Cloud className="h-4 w-4" />,
    [StorageProviderType.AwsS3]: <HardDrive className="h-4 w-4" />,
    [StorageProviderType.Dropbox]: <Cloud className="h-4 w-4" />,
}

interface StorageProfileSelectorProps {
    className?: string
}

export function StorageProfileSelector({ className }: StorageProfileSelectorProps) {
    const { selectedStorageProfileId, setSelectedStorageProfileId } = useTorrentStore()
    const { data: profiles, isLoading, error } = useStorageProfiles()

    // Auto-select default profile when profiles load
    useEffect(() => {
        if (profiles && profiles.length > 0 && !selectedStorageProfileId) {
            // Find default profile or first active profile
            const defaultProfile = profiles.find(p => p.isDefault && p.isActive)
            const firstActiveProfile = profiles.find(p => p.isActive)
            const profileToSelect = defaultProfile || firstActiveProfile

            if (profileToSelect) {
                setSelectedStorageProfileId(profileToSelect.id)
            }
        }
    }, [profiles, selectedStorageProfileId, setSelectedStorageProfileId])

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading storage profiles...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Failed to load storage profiles</span>
            </div>
        )
    }

    // Filter to only active profiles
    const activeProfiles = profiles?.filter(p => p.isActive) ?? []

    if (activeProfiles.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">No active storage profiles</span>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/storage">Connect Storage</Link>
                </Button>
            </div>
        )
    }

    const selectedProfile = activeProfiles.find(p => p.id === selectedStorageProfileId)

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {selectedProfile ? (
                            <div className="flex items-center gap-2">
                                {providerIcons[selectedProfile.providerType]}
                                <span>{selectedProfile.profileName}</span>
                                {selectedProfile.isDefault && (
                                    <Badge variant="secondary" className="text-xs">
                                        Default
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">Select storage destination</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[280px]">
                    {activeProfiles.map((profile) => (
                        <DropdownMenuItem
                            key={profile.id}
                            onClick={() => setSelectedStorageProfileId(profile.id)}
                            className={cn(
                                "flex items-center justify-between",
                                selectedStorageProfileId === profile.id && "bg-accent"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {providerIcons[profile.providerType]}
                                <span>{profile.profileName}</span>
                                {profile.isDefault && (
                                    <Badge variant="secondary" className="text-xs">
                                        Default
                                    </Badge>
                                )}
                            </div>
                            {selectedStorageProfileId === profile.id && (
                                <Check className="h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
