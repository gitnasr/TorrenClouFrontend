'use client'

import { useParams, useRouter } from 'next/navigation'
import { useStorageProfile, useSetDefaultProfile, useDisconnectProfile } from '@/hooks/useStorageProfiles'
import { LoadingState } from '@/components/shared'
import {
    StorageProfileHeader,
    StorageProfileInfoCard,
    StorageDetailsCard,
    StorageActionsCard,
    StorageErrorState,
} from '@/components/storage'

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
        return <LoadingState message="Loading storage profile..." />
    }

    if (error || !profile) {
        return <StorageErrorState error={error} />
    }

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <StorageProfileHeader profile={profile} />

            {/* Profile Card */}
            <StorageProfileInfoCard profile={profile} />

            {/* Details */}
            <StorageDetailsCard profile={profile} />

            {/* Actions */}
            <StorageActionsCard
                profile={profile}
                onSetDefault={handleSetDefault}
                onDisconnect={handleDisconnect}
                isSettingDefault={setDefaultMutation.isPending}
                isDisconnecting={disconnectMutation.isPending}
            />
        </div>
    )
}
