'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, AlertCircle, ExternalLink, Key } from 'lucide-react'
import { useOAuthCredentials, useConnectGoogleDrive } from '@/hooks/useStorageProfiles'
import {
    ConnectGoogleDriveRequestSchema,
    type ConnectGoogleDriveRequest,
} from '@/types/storage'
import {
    useStorageProfilesStore,
    selectConnectionError,
} from '@/stores/storageProfilesStore'

// Form input type (before Zod transforms)
type ConnectFormInput = {
    credentialId: number
    profileName?: string
    setAsDefault?: boolean
}

interface GoogleDriveConnectFormProps {
    onSuccess?: () => void
    className?: string
}

export function GoogleDriveConnectForm({ onSuccess, className }: GoogleDriveConnectFormProps) {
    const { data: credentials, isLoading: isLoadingCredentials } = useOAuthCredentials()
    const connectMutation = useConnectGoogleDrive()
    const connectionError = useStorageProfilesStore(selectConnectionError)
    const { setConnectionError } = useStorageProfilesStore()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ConnectFormInput, unknown, ConnectGoogleDriveRequest>({
        resolver: zodResolver(ConnectGoogleDriveRequestSchema),
        defaultValues: {
            credentialId: undefined as unknown as number,
            profileName: '',
            setAsDefault: false,
        },
    })

    const setAsDefault = watch('setAsDefault')
    const hasCredentials = credentials && credentials.length > 0

    const onSubmit = (data: ConnectGoogleDriveRequest) => {
        setConnectionError(null)
        connectMutation.mutate(data, {
            onSuccess: () => {
                onSuccess?.()
            },
        })
    }

    if (isLoadingCredentials) {
        return (
            <div className={className}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading credentials...
                </div>
            </div>
        )
    }

    if (!hasCredentials) {
        return (
            <div className={className}>
                <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4">
                    <Key className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-warning">No credentials saved</p>
                        <p className="text-muted-foreground mt-1">
                            Save your Google OAuth credentials above before connecting a Drive account.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <div className="space-y-4">
                {/* Credential Selector */}
                <div>
                    <label htmlFor="credentialId" className="text-sm font-medium mb-1.5 block">
                        OAuth Credentials
                    </label>
                    <Controller
                        name="credentialId"
                        control={control}
                        render={({ field }) => (
                            <select
                                id="credentialId"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                disabled={connectMutation.isPending}
                            >
                                <option value="">Select saved credentials...</option>
                                {credentials.map((cred) => (
                                    <option key={cred.id} value={cred.id}>
                                        {cred.name} ({cred.clientIdMasked})
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.credentialId && (
                        <p className="mt-1 text-sm text-danger">{errors.credentialId.message}</p>
                    )}
                </div>

                {/* Profile Name */}
                <div>
                    <label htmlFor="connectProfileName" className="text-sm font-medium mb-1.5 block">
                        Profile Name <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input
                        id="connectProfileName"
                        {...register('profileName')}
                        placeholder="My Google Drive"
                        maxLength={255}
                        disabled={connectMutation.isPending}
                    />
                    {errors.profileName && (
                        <p className="mt-1 text-sm text-danger">{errors.profileName.message}</p>
                    )}
                </div>

                {/* Set as Default */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="connectSetAsDefault"
                        checked={setAsDefault}
                        onChange={(e) => setValue('setAsDefault', e.target.checked)}
                        disabled={connectMutation.isPending}
                        className="h-4 w-4 rounded border-muted-foreground text-primary focus:ring-primary"
                    />
                    <label
                        htmlFor="connectSetAsDefault"
                        className="text-sm font-medium leading-none"
                    >
                        Set as default storage profile
                    </label>
                </div>

                {/* Connection Error */}
                {connectionError && (
                    <div className="flex gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3">
                        <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                        <div className="text-sm text-danger">{connectionError}</div>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={connectMutation.isPending}
                >
                    {connectMutation.isPending ? (
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
            </div>
        </form>
    )
}
