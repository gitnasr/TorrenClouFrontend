'use client'

import { Button } from '@/components/ui/button'
import { Cloud, Loader2, ExternalLink } from 'lucide-react'
import { useConnectGoogleDrive } from '@/hooks/useStorageProfiles'
import {
    useStorageProfilesStore,
    selectIsConnecting,
    selectConnectionError
} from '@/stores/storageProfilesStore'
import type { ConnectGoogleDriveButtonProps } from '@/types/storage'
import { cn } from '@/lib/utils'

export function ConnectGoogleDriveButton({ onSuccess, onError, className }: ConnectGoogleDriveButtonProps) {
    const connectMutation = useConnectGoogleDrive()
    const isConnecting = useStorageProfilesStore(selectIsConnecting)
    const connectionError = useStorageProfilesStore(selectConnectionError)

    const handleConnect = () => {
        connectMutation.mutate(undefined, {
            onSuccess: (profileId) => {
                onSuccess?.(profileId)
            },
            onError: (error) => {
                onError?.(error.message)
            },
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleConnect}
                disabled={isConnecting || connectMutation.isPending}
                className={cn('gap-2', className)}
                size="lg"
            >
                {(isConnecting || connectMutation.isPending) ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Cloud className="h-4 w-4" />
                        Connect Google Drive
                        <ExternalLink className="h-4 w-4" />
                    </>
                )}
            </Button>
            {connectionError && (
                <p className="text-sm text-danger">{connectionError}</p>
            )}
        </div>
    )
}
