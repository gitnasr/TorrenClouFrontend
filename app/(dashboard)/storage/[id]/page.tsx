'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Cloud,
    Trash2,
    ExternalLink,
    CheckCircle,
    Star,
    Loader2,
    Mail
} from 'lucide-react'
import { useStorageProfile, useSetDefaultProfile, useDisconnectProfile } from '@/hooks/useStorageProfiles'
import { formatDateTime } from '@/lib/utils/formatters'
import { StorageProviderType } from '@/types/enums'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const providerConfig: Record<StorageProviderType, { label: string; color: string; url: string }> = {
    [StorageProviderType.GoogleDrive]: { label: 'Google Drive', color: 'text-primary', url: 'https://drive.google.com' },
    [StorageProviderType.Dropbox]: { label: 'Dropbox', color: 'text-warning', url: 'https://www.dropbox.com' },
    [StorageProviderType.OneDrive]: { label: 'OneDrive', color: 'text-info', url: 'https://onedrive.live.com' },
    [StorageProviderType.AwsS3]: { label: 'AWS S3', color: 'text-danger', url: 'https://s3.console.aws.amazon.com' },
}

export default function StorageDetailPage() {
    const params = useParams()
    const router = useRouter()
    const profileId = Number(params.id)

    const { data: profile, isLoading, error } = useStorageProfile(profileId)
    const setDefaultMutation = useSetDefaultProfile()
    const disconnectMutation = useDisconnectProfile()

    const handleSetDefault = () => {
        if (!profile || profile.isDefault) return
        setDefaultMutation.mutate(profile.id)
    }

    const handleDisconnect = () => {
        if (!profile) return
        disconnectMutation.mutate(profile.id, {
            onSuccess: () => {
                router.push('/storage')
            },
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="space-y-8 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/storage">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
                <Card className="border-danger/50">
                    <CardContent className="p-6 text-center">
                        <p className="text-danger">
                            {error instanceof Error ? error.message : 'Profile not found'}
                        </p>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/storage">Back to Storage</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const config = providerConfig[profile.providerType] || providerConfig[StorageProviderType.GoogleDrive]

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/storage">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profile.profileName}</h1>
                    <p className="text-muted-foreground">Manage storage profile settings</p>
                </div>
            </div>

            {/* Profile Card */}
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

            {/* Details */}
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

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {!profile.isDefault && (
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleSetDefault}
                            disabled={setDefaultMutation.isPending}
                        >
                            {setDefaultMutation.isPending ? (
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
                    <Button
                        variant="outline"
                        className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
                        onClick={handleDisconnect}
                        disabled={disconnectMutation.isPending}
                    >
                        {disconnectMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Disconnect Profile
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
