'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Loader2, Info, AlertCircle, ArrowLeft, CheckCircle2, Shield } from 'lucide-react'
import { useSaveGoogleDriveCredentials, useAuthenticateGoogleDrive } from '@/hooks/useStorageProfiles'
import {
    SaveGoogleDriveCredentialsRequestSchema,
    type SaveGoogleDriveCredentialsRequest,
} from '@/types/storage'
import {
    useStorageProfilesStore,
    selectConnectionError,
    selectCurrentStep,
    selectPendingProfileId,
} from '@/stores/storageProfilesStore'

const GOOGLE_CLOUD_CONSOLE_URL = 'https://console.cloud.google.com/apis/credentials'

// Form input type (before Zod transforms defaults)
type GoogleDriveCredentialsFormInput = {
    clientId: string
    clientSecret: string
    redirectUri: string
    profileName?: string
    setAsDefault?: boolean
}

interface GoogleDriveConfigFormProps {
    onSuccess?: () => void
}

export function GoogleDriveConfigForm({ onSuccess }: GoogleDriveConfigFormProps) {
    const saveCredentials = useSaveGoogleDriveCredentials()
    const authenticateGoogleDrive = useAuthenticateGoogleDrive()
    const connectionError = useStorageProfilesStore(selectConnectionError)
    const currentStep = useStorageProfilesStore(selectCurrentStep)
    const pendingProfileId = useStorageProfilesStore(selectPendingProfileId)
    const { setCurrentStep, setConnectionError } = useStorageProfilesStore()

    // Auto-generate redirect URI based on backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    const defaultRedirectUri = `${backendUrl}/api/storage/gdrive/callback`

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<GoogleDriveCredentialsFormInput, unknown, SaveGoogleDriveCredentialsRequest>({
        resolver: zodResolver(SaveGoogleDriveCredentialsRequestSchema),
        defaultValues: {
            profileName: '',
            clientId: '',
            clientSecret: '',
            redirectUri: defaultRedirectUri,
            setAsDefault: false,
        },
    })

    const setAsDefault = watch('setAsDefault')

    const onSubmitCredentials = (data: SaveGoogleDriveCredentialsRequest) => {
        saveCredentials.mutate(data)
    }

    const onAuthenticate = () => {
        if (!pendingProfileId) return
        setConnectionError(null)
        authenticateGoogleDrive.mutate(pendingProfileId, {
            onSuccess: () => {
                onSuccess?.()
            },
        })
    }

    const handleBack = () => {
        setCurrentStep(1)
        setConnectionError(null)
    }

    const isPending = saveCredentials.isPending || authenticateGoogleDrive.isPending

    // Step 2: Authenticate with Google
    if (currentStep === 2 && pendingProfileId) {
        return (
            <div className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-success font-medium">Credentials</span>
                    </div>
                    <span className="text-muted-foreground">/</span>
                    <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="font-medium text-foreground">Authenticate</span>
                    </div>
                </div>

                {/* Success Banner */}
                <div className="flex gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
                    <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-success">Credentials saved successfully</p>
                        <p className="text-muted-foreground mt-1">
                            Your OAuth credentials have been securely stored. Click below to authenticate with Google and complete the setup.
                        </p>
                    </div>
                </div>

                {/* Connection Error */}
                {connectionError && (
                    <div className="flex gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4">
                        <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                        <div className="text-sm text-danger">{connectionError}</div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={isPending}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        className="flex-1"
                        size="lg"
                        onClick={onAuthenticate}
                        disabled={isPending}
                    >
                        {authenticateGoogleDrive.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Authenticate with Google
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    // Step 1: Enter Credentials
    return (
        <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium text-foreground">Credentials</span>
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    <span>Authenticate</span>
                </div>
            </div>

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
                    Profile Name <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                    id="profileName"
                    {...register('profileName')}
                    placeholder="My Google Drive"
                    maxLength={255}
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                disabled={isPending}
            >
                {saveCredentials.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Credentials...
                    </>
                ) : (
                    'Save Credentials & Continue'
                )}
            </Button>
        </form>
    )
}
