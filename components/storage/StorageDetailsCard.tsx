'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils/formatters'
import type { StorageProfileDetail } from '@/types/storage'
import { getStorageProviderConfig } from './StorageProviderConfig'
import { StorageProviderType } from '@/types/enums'
import { cn } from '@/lib/utils'

interface StorageDetailsCardProps {
    profile: StorageProfileDetail
}

export function StorageDetailsCard({ profile }: StorageDetailsCardProps) {
    const config = getStorageProviderConfig(profile.providerType)
    const isGoogleDrive = profile.providerType === StorageProviderType.GoogleDrive

    const getStatusLabel = () => {
        if (!profile.isActive) return { text: 'Disconnected', color: 'text-muted-foreground' }
        if (isGoogleDrive && profile.needsReauth) return { text: 'Reconnection Required', color: 'text-danger' }
        if (isGoogleDrive && !profile.isConfigured) return { text: 'Pending Setup', color: 'text-warning' }
        return { text: 'Active', color: 'text-success' }
    }

    const getConfigurationLabel = () => {
        if (profile.isConfigured) return { text: 'Configured', color: 'text-success' }
        return { text: 'Pending Setup', color: 'text-warning' }
    }

    const getAuthenticationLabel = () => {
        if (profile.needsReauth) return { text: 'Expired — Reconnection Required', color: 'text-danger' }
        if (profile.isConfigured) return { text: 'Valid', color: 'text-success' }
        return { text: 'Not Authenticated', color: 'text-muted-foreground' }
    }

    const status = getStatusLabel()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Profile ID</p>
                        <p className="font-medium">#{profile.id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Provider</p>
                        <p className="font-medium">{config.label}</p>
                    </div>
                    {profile.email && (
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile.email}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDateTime(profile.createdAt)}</p>
                    </div>
                    {profile.updatedAt && (
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-medium">{formatDateTime(profile.updatedAt)}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={cn('font-medium', status.color)}>{status.text}</p>
                    </div>
                    {isGoogleDrive && (
                        <>
                            <div>
                                <p className="text-sm text-muted-foreground">Configuration</p>
                                {(() => {
                                    const cfg = getConfigurationLabel()
                                    return <p className={cn('font-medium', cfg.color)}>{cfg.text}</p>
                                })()}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Authentication</p>
                                {(() => {
                                    const auth = getAuthenticationLabel()
                                    return <p className={cn('font-medium', auth.color)}>{auth.text}</p>
                                })()}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}



