'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils/formatters'
import type { StorageProfile } from '@/types/storage'
import { getStorageProviderConfig } from './StorageProviderConfig'

interface StorageDetailsCardProps {
    profile: StorageProfile
}

export function StorageDetailsCard({ profile }: StorageDetailsCardProps) {
    const config = getStorageProviderConfig(profile.providerType)

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
                        <p className="font-medium text-success">Active</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

