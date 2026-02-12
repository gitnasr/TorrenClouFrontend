'use client'

import { useParams, useRouter } from 'next/navigation'
import {
    useStorageProfile,
    useSetDefaultProfile,
    useDisconnectProfile,
    useAuthenticateGoogleDrive,
    useReauthenticateGoogleDrive,
} from '@/hooks/useStorageProfiles'
import { LoadingState } from '@/components/shared'
import {
    StorageProfileHeader,
    StorageProfileInfoCard,
    StorageDetailsCard,
    StorageActionsCard,
    StorageErrorState,
} from '@/components/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react'
import { StorageProviderType } from '@/types/enums'

export default function StorageDetailPage() {
    const params = useParams()
    const router = useRouter()
    const profileId = Number(params.id)

    const { data: profile, isLoading, error } = useStorageProfile(profileId)
    const setDefaultMutation = useSetDefaultProfile()
    const disconnectMutation = useDisconnectProfile()
    const authenticateMutation = useAuthenticateGoogleDrive()
    const reauthenticateMutation = useReauthenticateGoogleDrive()

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

    const handleAuthenticate = () => {
        if (!profile) return
        authenticateMutation.mutate(profile.id)
    }

    const handleReauthenticate = () => {
        if (!profile) return
        reauthenticateMutation.mutate(profile.id)
    }

    if (isLoading) {
        return <LoadingState message="Loading storage profile..." />
    }

    if (error || !profile) {
        return <StorageErrorState error={error} />
    }

    const isGoogleDrive = profile.providerType === StorageProviderType.GoogleDrive
    const needsSetup = isGoogleDrive && !profile.isConfigured && !profile.needsReauth
    const needsReauth = isGoogleDrive && profile.needsReauth

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <StorageProfileHeader profile={profile} />

            {/* Re-authentication Warning Banner */}
            {needsReauth && (
                <Card className="border-danger/50 bg-danger/5">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-danger shrink-0" />
                            <div>
                                <p className="font-medium text-danger">Connection Expired</p>
                                <p className="text-sm text-muted-foreground">
                                    Your Google Drive refresh token has expired or been revoked. Reconnect to continue syncing files.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            className="shrink-0 bg-danger hover:bg-danger/90 text-danger-foreground"
                            onClick={handleReauthenticate}
                            disabled={reauthenticateMutation.isPending}
                        >
                            {reauthenticateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ExternalLink className="mr-2 h-4 w-4" />
                            )}
                            Reconnect
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Incomplete Setup Banner */}
            {needsSetup && (
                <Card className="border-warning/50 bg-warning/5">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                            <div>
                                <p className="font-medium text-warning">Setup Incomplete</p>
                                <p className="text-sm text-muted-foreground">
                                    Credentials have been saved but OAuth authentication has not been completed. Authenticate with Google to start using this profile.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            className="shrink-0"
                            onClick={handleAuthenticate}
                            disabled={authenticateMutation.isPending}
                        >
                            {authenticateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ExternalLink className="mr-2 h-4 w-4" />
                            )}
                            Complete Setup
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Profile Card */}
            <StorageProfileInfoCard profile={profile} />

            {/* Details */}
            <StorageDetailsCard profile={profile} />

            {/* Actions */}
            <StorageActionsCard
                profile={profile}
                onSetDefault={handleSetDefault}
                onDisconnect={handleDisconnect}
                onAuthenticate={handleAuthenticate}
                onReauthenticate={handleReauthenticate}
                isSettingDefault={setDefaultMutation.isPending}
                isDisconnecting={disconnectMutation.isPending}
                isAuthenticating={authenticateMutation.isPending}
                isReauthenticating={reauthenticateMutation.isPending}
            />
        </div>
    )
}
