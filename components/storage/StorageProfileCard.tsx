'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cloud, Settings, Star, Loader2, Mail, AlertTriangle, ExternalLink } from 'lucide-react'
import { StorageProviderType } from '@/types/enums'
import type { StorageProfileCardProps } from '@/types/storage'
import { useSetDefaultProfile, useAuthenticateGoogleDrive, useReauthenticateGoogleDrive } from '@/hooks/useStorageProfiles'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const providerConfig: Record<StorageProviderType, { icon: React.ReactNode; color: string; label: string }> = {
    [StorageProviderType.GoogleDrive]: {
        icon: <Cloud className="h-5 w-5" />,
        color: 'text-primary',
        label: 'Google Drive',
    },
    [StorageProviderType.Dropbox]: {
        icon: <Cloud className="h-5 w-5" />,
        color: 'text-warning',
        label: 'Dropbox',
    },
    [StorageProviderType.OneDrive]: {
        icon: <Cloud className="h-5 w-5" />,
        color: 'text-info',
        label: 'OneDrive',
    },
    [StorageProviderType.AwsS3]: {
        icon: <Cloud className="h-5 w-5" />,
        color: 'text-danger',
        label: 'AWS S3',
    },
}

export function StorageProfileCard({ profile, className }: StorageProfileCardProps) {
    const setDefaultMutation = useSetDefaultProfile()
    const authenticateMutation = useAuthenticateGoogleDrive()
    const reauthenticateMutation = useReauthenticateGoogleDrive()
    const config = providerConfig[profile.providerType] || providerConfig[StorageProviderType.GoogleDrive]

    const handleSetDefault = () => {
        if (profile.isDefault) return
        setDefaultMutation.mutate(profile.id)
    }

    const handleCompleteSetup = () => {
        authenticateMutation.mutate(profile.id)
    }

    const handleReauthenticate = () => {
        reauthenticateMutation.mutate(profile.id)
    }

    const isGoogleDrive = profile.providerType === StorageProviderType.GoogleDrive
    const needsSetup = isGoogleDrive && !profile.isConfigured && !profile.needsReauth
    const needsReauth = isGoogleDrive && profile.needsReauth
    const isActionPending = authenticateMutation.isPending || reauthenticateMutation.isPending

    const getBadge = () => {
        if (needsSetup) {
            return <Badge variant="outline" className="border-warning text-warning">Setup Incomplete</Badge>
        }
        if (needsReauth) {
            return <Badge variant="outline" className="border-danger text-danger">Reconnect Required</Badge>
        }
        if (profile.isDefault) {
            return (
                <Badge variant="default">
                    <Star className="mr-1 h-3 w-3" />
                    Default
                </Badge>
            )
        }
        return <Badge variant="outline">Active</Badge>
    }

    return (
        <Card className={cn('group hover:shadow-lg transition-shadow', className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl bg-muted',
                            config.color
                        )}>
                            {config.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold">{profile.profileName}</h3>
                            <p className="text-sm text-muted-foreground">{config.label}</p>
                            {profile.email && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Mail className="h-3 w-3" />
                                    {profile.email}
                                </p>
                            )}
                        </div>
                    </div>
                    {getBadge()}
                </div>

                {/* Reauth Warning Banner */}
                {needsReauth && (
                    <div className="mt-3 flex gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Connection expired. Reconnect to continue syncing.</span>
                    </div>
                )}

                {/* Incomplete Setup Banner */}
                {needsSetup && (
                    <div className="mt-3 flex gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>OAuth setup not completed. Authenticate to start using this profile.</span>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    {needsSetup ? (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleCompleteSetup}
                            disabled={isActionPending}
                        >
                            {authenticateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ExternalLink className="mr-2 h-4 w-4" />
                            )}
                            Complete Setup
                        </Button>
                    ) : needsReauth ? (
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-danger hover:bg-danger/90 text-danger-foreground"
                            onClick={handleReauthenticate}
                            disabled={isActionPending}
                        >
                            {reauthenticateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ExternalLink className="mr-2 h-4 w-4" />
                            )}
                            Reconnect
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/storage/${profile.id}`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage
                            </Link>
                        </Button>
                    )}
                    {!profile.isDefault && !needsSetup && !needsReauth && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSetDefault}
                            disabled={setDefaultMutation.isPending}
                        >
                            {setDefaultMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Star className="mr-2 h-4 w-4" />
                                    Set Default
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
