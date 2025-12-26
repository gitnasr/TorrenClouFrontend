'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink, Trash2, Loader2 } from 'lucide-react'
import type { StorageProfile } from '@/types/storage'
import { getStorageProviderConfig } from './StorageProviderConfig'

interface StorageActionsCardProps {
    profile: StorageProfile
    onSetDefault?: () => void
    onDisconnect?: () => void
    isSettingDefault?: boolean
    isDisconnecting?: boolean
}

export function StorageActionsCard({
    profile,
    onSetDefault,
    onDisconnect,
    isSettingDefault,
    isDisconnecting,
}: StorageActionsCardProps) {
    const config = getStorageProviderConfig(profile.providerType)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {!profile.isDefault && onSetDefault && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={onSetDefault}
                        disabled={isSettingDefault}
                    >
                        {isSettingDefault ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Star className="mr-2 h-4 w-4" />
                        )}
                        Set as Default
                    </Button>
                )}
                <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={config.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in {config.label}
                    </a>
                </Button>
                {onDisconnect && (
                    <Button
                        variant="outline"
                        className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
                        onClick={onDisconnect}
                        disabled={isDisconnecting}
                    >
                        {isDisconnecting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Disconnect Profile
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

