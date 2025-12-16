'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cloud, Settings, Star, Loader2, Mail } from 'lucide-react'
import { StorageProviderType } from '@/types/enums'
import type { StorageProfileCardProps } from '@/types/storage'
import { useSetDefaultProfile } from '@/hooks/useStorageProfiles'
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
    const config = providerConfig[profile.providerType] || providerConfig[StorageProviderType.GoogleDrive]

    const handleSetDefault = () => {
        if (profile.isDefault) return
        setDefaultMutation.mutate(profile.id)
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
                    <Badge variant={profile.isDefault ? 'default' : 'outline'}>
                        {profile.isDefault ? (
                            <>
                                <Star className="mr-1 h-3 w-3" />
                                Default
                            </>
                        ) : (
                            'Active'
                        )}
                    </Badge>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/storage/${profile.id}`}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage
                        </Link>
                    </Button>
                    {!profile.isDefault && (
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
