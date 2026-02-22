'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Info, AlertCircle, Server } from 'lucide-react'
import { useConfigureS3 } from '@/hooks/useStorageProfiles'
import {
    ConfigureS3RequestSchema,
    type ConfigureS3Request,
} from '@/types/storage'
import {
    useStorageProfilesStore,
    selectConnectionError,
} from '@/stores/storageProfilesStore'

// Common S3-compatible endpoint presets.
// Cloudflare R2 uses a sentinel key ('__r2__') because the endpoint is account-specific
// and must be entered manually — auto-filling a placeholder passes validation but fails
// at runtime. When this preset is selected, the endpoint field is intentionally left empty.
const S3_PRESETS = [
    { key: '', label: 'Custom Endpoint', value: '' },
    { key: 'aws-us-east-1', label: 'AWS S3 (us-east-1)', value: 'https://s3.us-east-1.amazonaws.com', region: 'us-east-1' },
    { key: 'aws-us-west-2', label: 'AWS S3 (us-west-2)', value: 'https://s3.us-west-2.amazonaws.com', region: 'us-west-2' },
    { key: 'aws-eu-west-1', label: 'AWS S3 (eu-west-1)', value: 'https://s3.eu-west-1.amazonaws.com', region: 'eu-west-1' },
    { key: 'aws-ap-southeast-1', label: 'AWS S3 (ap-southeast-1)', value: 'https://s3.ap-southeast-1.amazonaws.com', region: 'ap-southeast-1' },
    { key: 'b2-us-west', label: 'Backblaze B2 (US West)', value: 'https://s3.us-west-000.backblazeb2.com', region: 'us-west-000' },
    { key: 'b2-us-east', label: 'Backblaze B2 (US East)', value: 'https://s3.us-east-005.backblazeb2.com', region: 'us-east-005' },
    { key: 'b2-eu-central', label: 'Backblaze B2 (EU Central)', value: 'https://s3.eu-central-003.backblazeb2.com', region: 'eu-central-003' },
    { key: '__r2__', label: 'Cloudflare R2', value: '', region: 'auto' },
    { key: 'do-nyc3', label: 'DigitalOcean Spaces (NYC3)', value: 'https://nyc3.digitaloceanspaces.com', region: 'nyc3' },
    { key: 'do-ams3', label: 'DigitalOcean Spaces (AMS3)', value: 'https://ams3.digitaloceanspaces.com', region: 'ams3' },
    { key: 'wasabi', label: 'Wasabi (US East 1)', value: 'https://s3.wasabisys.com', region: 'us-east-1' },
    { key: 'minio', label: 'MinIO (Local)', value: 'http://localhost:9000', region: 'us-east-1' },
]

interface S3ConfigFormProps {
    onSuccess?: () => void
}

export function S3ConfigForm({ onSuccess }: S3ConfigFormProps) {
    const configureS3 = useConfigureS3()
    const connectionError = useStorageProfilesStore(selectConnectionError)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ConfigureS3Request>({
        resolver: zodResolver(ConfigureS3RequestSchema),
        defaultValues: {
            profileName: '',
            s3Endpoint: '',
            s3AccessKey: '',
            s3SecretKey: '',
            s3BucketName: '',
            s3Region: '',
            setAsDefault: false,
        },
    })

    const setAsDefault = watch('setAsDefault')
    const [selectedPresetKey, setSelectedPresetKey] = useState<string>('')

    const handlePresetChange = (presetKey: string) => {
        setSelectedPresetKey(presetKey)
        const preset = S3_PRESETS.find(p => p.key === presetKey)
        if (preset && preset.value) {
            // Known endpoint — fill in the URL and region
            setValue('s3Endpoint', preset.value)
            setValue('s3Region', preset.region || '')
        } else {
            // Custom Endpoint or Cloudflare R2 — clear so user must enter real values
            setValue('s3Endpoint', '')
            setValue('s3Region', preset?.region || '')
        }
    }

    const onSubmit = (data: ConfigureS3Request) => {
        configureS3.mutate(data, {
            onSuccess: () => {
                onSuccess?.()
            },
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Info Box */}
            <div className="flex gap-3 rounded-lg border border-info/30 bg-info/10 p-4">
                <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <div className="text-sm">
                    Configure S3-compatible storage. Supports AWS S3, Backblaze B2, Cloudflare R2,
                    DigitalOcean Spaces, Wasabi, and MinIO.
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
                    placeholder="My S3 Storage"
                    maxLength={50}
                    disabled={configureS3.isPending}
                />
                {errors.profileName && (
                    <p className="mt-1 text-sm text-danger">{errors.profileName.message}</p>
                )}
            </div>

            {/* Endpoint Preset */}
            <div>
                <label htmlFor="endpointPreset" className="text-sm font-medium mb-2 block">
                    Provider Preset
                </label>
                <select
                    id="endpointPreset"
                    onChange={(e) => handlePresetChange(e.target.value)}
                    disabled={configureS3.isPending}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {S3_PRESETS.map((preset) => (
                        <option key={preset.key || 'custom'} value={preset.key}>
                            {preset.label}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                    Select a preset or enter a custom endpoint below
                </p>
            </div>

            {/* S3 Endpoint */}
            <div>
                <label htmlFor="s3Endpoint" className="text-sm font-medium mb-2 block">
                    S3 Endpoint URL
                </label>
                <Input
                    id="s3Endpoint"
                    {...register('s3Endpoint')}
                    placeholder="https://s3.us-east-1.amazonaws.com"
                    disabled={configureS3.isPending}
                />
                {selectedPresetKey === '__r2__' && (
                    <p className="mt-1 text-xs text-info">
                        Enter your Cloudflare R2 endpoint:{' '}
                        <span className="font-mono">https://&lt;account_id&gt;.r2.cloudflarestorage.com</span>
                    </p>
                )}
                {errors.s3Endpoint && (
                    <p className="mt-1 text-sm text-danger">{errors.s3Endpoint.message}</p>
                )}
            </div>

            {/* Access Key */}
            <div>
                <label htmlFor="s3AccessKey" className="text-sm font-medium mb-2 block">
                    Access Key ID
                </label>
                <Input
                    id="s3AccessKey"
                    {...register('s3AccessKey')}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    disabled={configureS3.isPending}
                />
                {errors.s3AccessKey && (
                    <p className="mt-1 text-sm text-danger">{errors.s3AccessKey.message}</p>
                )}
            </div>

            {/* Secret Key */}
            <div>
                <label htmlFor="s3SecretKey" className="text-sm font-medium mb-2 block">
                    Secret Access Key
                </label>
                <Input
                    id="s3SecretKey"
                    {...register('s3SecretKey')}
                    type="password"
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                    disabled={configureS3.isPending}
                />
                {errors.s3SecretKey && (
                    <p className="mt-1 text-sm text-danger">{errors.s3SecretKey.message}</p>
                )}
            </div>

            {/* Bucket Name */}
            <div>
                <label htmlFor="s3BucketName" className="text-sm font-medium mb-2 block">
                    Bucket Name
                </label>
                <Input
                    id="s3BucketName"
                    {...register('s3BucketName')}
                    placeholder="my-bucket"
                    disabled={configureS3.isPending}
                />
                {errors.s3BucketName && (
                    <p className="mt-1 text-sm text-danger">{errors.s3BucketName.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    Bucket must already exist
                </p>
            </div>

            {/* Region */}
            <div>
                <label htmlFor="s3Region" className="text-sm font-medium mb-2 block">
                    Region
                </label>
                <Input
                    id="s3Region"
                    {...register('s3Region')}
                    placeholder="us-east-1"
                    disabled={configureS3.isPending}
                />
                {errors.s3Region && (
                    <p className="mt-1 text-sm text-danger">{errors.s3Region.message}</p>
                )}
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="setAsDefault"
                    checked={setAsDefault}
                    onChange={(e) => setValue('setAsDefault', e.target.checked)}
                    disabled={configureS3.isPending}
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
                disabled={configureS3.isPending}
            >
                {configureS3.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Configuring...
                    </>
                ) : (
                    <>
                        <Server className="mr-2 h-4 w-4" />
                        Configure S3 Storage
                    </>
                )}
            </Button>
        </form>
    )
}
