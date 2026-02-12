'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink, Trash2, Loader2, RefreshCw } from 'lucide-react'
import type { StorageProfile } from '@/types/storage'
import { getStorageProviderConfig } from './StorageProviderConfig'
import { StorageProviderType } from '@/types/enums'

interface StorageActionsCardProps {
    profile: StorageProfile
    onSetDefault?: () => void
    onDisconnect?: () => void
    onAuthenticate?: () => void
    onReauthenticate?: () => void
    isSettingDefault?: boolean
    isDisconnecting?: boolean
    isAuthenticating?: boolean
    isReauthenticating?: boolean
}

export function StorageActionsCard({
    profile,
    onSetDefault,
    onDisconnect,
    onAuthenticate,
    onReauthenticate,
    isSettingDefault,
    isDisconnecting,
    isAuthenticating,
    isReauthenticating,
}: StorageActionsCardProps) {
    const config = getStorageProviderConfig(profile.providerType)
    const isGoogleDrive = profile.providerType === StorageProviderType.GoogleDrive

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Re-authenticate button (shown when token expired) */}
                {isGoogleDrive && profile.needsReauth && onReauthenticate && (
                    <Button
                        variant="outline"
                        className="w-full justify-start border-danger text-danger hover:text-danger hover:bg-danger/10"
                        onClick={onReauthenticate}
                        disabled={isReauthenticating}
                    >
                        {isReauthenticating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Reconnect Google Drive
                    </Button>
                )}

                {/* Complete setup button (shown when credentials saved but not yet authenticated) */}
                {isGoogleDrive && !profile.isConfigured && !profile.needsReauth && onAuthenticate && (
                    <Button
                        variant="outline"
                        className="w-full justify-start border-warning text-warning hover:text-warning hover:bg-warning/10"
                        onClick={onAuthenticate}
                        disabled={isAuthenticating}
                    >
                        {isAuthenticating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ExternalLink className="mr-2 h-4 w-4" />
                        )}
                        Complete Setup — Authenticate with Google
                    </Button>
                )}

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



