'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cloud, CheckCircle, Star, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StorageProfile } from '@/types/storage'
import { getStorageProviderConfig } from './StorageProviderConfig'

interface StorageProfileInfoCardProps {
    profile: StorageProfile
}

export function StorageProfileInfoCard({ profile }: StorageProfileInfoCardProps) {
    const config = getStorageProviderConfig(profile.providerType)

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            'flex h-16 w-16 items-center justify-center rounded-xl bg-muted',
                            config.color
                        )}>
                            <Cloud className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{profile.profileName}</h2>
                            <p className="text-muted-foreground">{config.label}</p>
                            {profile.email && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {profile.email}
                                </p>
                            )}
                            {profile.isDefault && (
                                <Badge variant="default" className="mt-2">
                                    <Star className="mr-1 h-3 w-3" />
                                    Default
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium text-success">Connected</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

