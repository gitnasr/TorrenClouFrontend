'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Loader2, Info, AlertCircle } from 'lucide-react'
import { useConnectGoogleDrive } from '@/hooks/useStorageProfiles'
import {
    ConfigureGoogleDriveRequestSchema,
    type ConfigureGoogleDriveRequest,
} from '@/types/storage'
import {
    useStorageProfilesStore,
    selectConnectionError,
} from '@/stores/storageProfilesStore'

const GOOGLE_CLOUD_CONSOLE_URL = 'https://console.cloud.google.com/apis/credentials'

interface GoogleDriveConfigFormProps {
    onSuccess?: () => void
}

export function GoogleDriveConfigForm({ onSuccess }: GoogleDriveConfigFormProps) {
    const connectGoogleDrive = useConnectGoogleDrive()
    const connectionError = useStorageProfilesStore(selectConnectionError)

    // Auto-generate redirect URI based on backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    const defaultRedirectUri = `${backendUrl}/api/storage/gdrive/callback`

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ConfigureGoogleDriveRequest>({
        resolver: zodResolver(ConfigureGoogleDriveRequestSchema),
        defaultValues: {
            profileName: '',
            clientId: '',
            clientSecret: '',
            redirectUri: defaultRedirectUri,
            setAsDefault: false,
        },
    })

    const setAsDefault = watch('setAsDefault')

    const onSubmit = (data: ConfigureGoogleDriveRequest) => {
        connectGoogleDrive.mutate(data, {
            onSuccess: () => {
                onSuccess?.()
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Setup Guide Link */}
            <div className="flex gap-3 rounded-lg border border-info/30 bg-info/10 p-4">
                <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <div className="text-sm">
                    You need to create OAuth credentials in Google Cloud Console.{' '}
                    <a
                        href={GOOGLE_CLOUD_CONSOLE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                        Open Google Cloud Console
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>

            {/* Profile Name */}
            <div>
                <label htmlFor="profileName" className="text-sm font-medium mb-2 block">
                    Profile Name
                </label>
                <Input
                    id="profileName"
                    {...register('profileName')}
                    placeholder="My Google Drive"
                    maxLength={50}
                    disabled={connectGoogleDrive.isPending}
                />
                {errors.profileName && (
                    <p className="mt-1 text-sm text-danger">{errors.profileName.message}</p>
                )}
            </div>

            {/* Client ID */}
            <div>
                <label htmlFor="clientId" className="text-sm font-medium mb-2 block">
                    Client ID
                </label>
                <Input
                    id="clientId"
                    {...register('clientId')}
                    placeholder="123456789-xxxxx.apps.googleusercontent.com"
                    disabled={connectGoogleDrive.isPending}
                />
                {errors.clientId && (
                    <p className="mt-1 text-sm text-danger">{errors.clientId.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    Must end with .apps.googleusercontent.com
                </p>
            </div>

            {/* Client Secret */}
            <div>
                <label htmlFor="clientSecret" className="text-sm font-medium mb-2 block">
                    Client Secret
                </label>
                <Input
                    id="clientSecret"
                    {...register('clientSecret')}
                    type="password"
                    placeholder="GOCSPX-..."
                    disabled={connectGoogleDrive.isPending}
                />
                {errors.clientSecret && (
                    <p className="mt-1 text-sm text-danger">{errors.clientSecret.message}</p>
                )}
            </div>

            {/* Redirect URI (auto-populated, read-only) */}
            <div>
                <label htmlFor="redirectUri" className="text-sm font-medium mb-2 block">
                    Redirect URI
                </label>
                <Input
                    id="redirectUri"
                    {...register('redirectUri')}
                    className="bg-muted"
                    readOnly
                    disabled={connectGoogleDrive.isPending}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    Add this URI to your Google Cloud OAuth Authorized redirect URIs
                </p>
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="setAsDefault"
                    checked={setAsDefault}
                    onChange={(e) => setValue('setAsDefault', e.target.checked)}
                    disabled={connectGoogleDrive.isPending}
                    className="h-4 w-4 rounded border-muted-foreground text-primary focus:ring-primary"
                />
                <label
                    htmlFor="setAsDefault"
                    className="text-sm font-medium leading-none"
                >
                    Set as default storage profile
                </label>
            </div>

            {/* Connection Error */}
            {connectionError && (
                <div className="flex gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4">
                    <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                    <div className="text-sm text-danger">{connectionError}</div>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={connectGoogleDrive.isPending}
            >
                {connectGoogleDrive.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        Connect Google Drive
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </form>
    )
}
