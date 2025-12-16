'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Cloud, Server, HardDrive, CheckCircle, Loader2, ExternalLink } from 'lucide-react'
import { StorageProviderType } from '@/types/enums'
import { profileNameSchema } from '@/types/storage'
import { useConnectGoogleDrive } from '@/hooks/useStorageProfiles'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const providers = [
    {
        type: StorageProviderType.GoogleDrive,
        name: 'Google Drive',
        description: 'Connect your Google account',
        icon: Cloud,
        color: 'text-primary',
        bgColor: 'bg-primary/20',
        oauthBased: true,
        available: true,
    },
    {
        type: StorageProviderType.OneDrive,
        name: 'OneDrive',
        description: 'Connect your Microsoft account',
        icon: Cloud,
        color: 'text-info',
        bgColor: 'bg-info/20',
        oauthBased: true,
        available: false, // Coming soon
    },
    {
        type: StorageProviderType.Dropbox,
        name: 'Dropbox',
        description: 'Connect your Dropbox account',
        icon: Cloud,
        color: 'text-warning',
        bgColor: 'bg-warning/20',
        oauthBased: true,
        available: false, // Coming soon
    },
    {
        type: StorageProviderType.AwsS3,
        name: 'AWS S3',
        description: 'Connect using API credentials',
        icon: Server,
        color: 'text-danger',
        bgColor: 'bg-danger/20',
        fields: [
            { key: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket' },
            { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1' },
            { key: 'accessKey', label: 'Access Key ID', type: 'text', placeholder: 'AKIA...' },
            { key: 'secretKey', label: 'Secret Access Key', type: 'password', placeholder: '••••••••' },
        ],
        oauthBased: false,
        available: false, // Coming soon
    },
]

const connectFormSchema = z.object({
    profileName: profileNameSchema.optional().or(z.literal('')),
})

type ConnectFormData = z.infer<typeof connectFormSchema>

export default function NewStoragePage() {
    const [selectedProvider, setSelectedProvider] = useState<StorageProviderType | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const connectGoogleDrive = useConnectGoogleDrive()

    const selectedProviderInfo = providers.find(p => p.type === selectedProvider)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ConnectFormData>({
        resolver: zodResolver(connectFormSchema),
        defaultValues: {
            profileName: '',
        },
    })

    const handleFieldChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const onSubmit = (data: ConnectFormData) => {
        if (!selectedProvider) {
            toast.error('Please select a provider')
            return
        }

        if (selectedProvider === StorageProviderType.GoogleDrive) {
            const finalName = data.profileName?.trim() || undefined
            connectGoogleDrive.mutate(finalName, {
                onSuccess: () => {
                    reset()
                },
            })
            return
        }

        // For other providers (not yet implemented)
        toast.info('This provider is coming soon!')
    }

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
                <div>
                    <h1 className="text-2xl font-bold">Add Storage Profile</h1>
                    <p className="text-muted-foreground">Connect a cloud storage provider</p>
                </div>
            </div>

            {/* Provider Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Provider</CardTitle>
                    <CardDescription>Choose where you want your files to be stored</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {providers.map((provider) => {
                            const Icon = provider.icon
                            const isSelected = selectedProvider === provider.type
                            const isDisabled = !provider.available

                            return (
                                <button
                                    key={provider.type}
                                    onClick={() => !isDisabled && setSelectedProvider(provider.type)}
                                    disabled={isDisabled}
                                    className={cn(
                                        'flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all relative',
                                        isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50',
                                        isDisabled && 'opacity-50 cursor-not-allowed hover:border-border'
                                    )}
                                >
                                    <div className={cn(
                                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                                        provider.bgColor,
                                        provider.color
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{provider.name}</h3>
                                            {isSelected && (
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {provider.description}
                                        </p>
                                        {isDisabled && (
                                            <span className="text-xs text-warning mt-1 inline-block">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Connection Card */}
            {selectedProvider && selectedProviderInfo?.available && (
                <Card>
                    <CardHeader>
                        <CardTitle>Connect {selectedProviderInfo.name}</CardTitle>
                        <CardDescription>
                            {selectedProviderInfo.oauthBased
                                ? 'Enter a profile name and authorize TorreClou to access your storage'
                                : 'Enter your credentials to connect'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Profile Name Input - Common for all providers */}
                            <div>
                                <label htmlFor="profileName" className="text-sm font-medium mb-2 block">
                                    Profile Name (Optional)
                                </label>
                                <Input
                                    id="profileName"
                                    {...register('profileName')}
                                    placeholder={`My ${selectedProviderInfo.name}`}
                                    maxLength={50}
                                    disabled={connectGoogleDrive.isPending}
                                />
                                {errors.profileName && (
                                    <p className="mt-1 text-sm text-danger">{errors.profileName.message}</p>
                                )}
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Leave empty to use default name. 3-50 characters allowed.
                                </p>
                            </div>

                            {selectedProviderInfo.oauthBased ? (
                                <>
                                    <div className="rounded-lg bg-surface-tonal p-4">
                                        <p className="text-sm text-muted-foreground">
                                            You&apos;ll be redirected to {selectedProviderInfo.name} to authorize access.
                                            TorreClou will only have access to files it creates.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={connectGoogleDrive.isPending || !!errors.profileName}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {connectGoogleDrive.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                Connect with {selectedProviderInfo.name}
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {selectedProviderInfo.fields?.map((field) => (
                                        <div key={field.key}>
                                            <label className="text-sm font-medium">{field.label}</label>
                                            <Input
                                                className="mt-1"
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={formData[field.key] || ''}
                                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                            />
                                        </div>
                                    ))}

                                    <Button
                                        type="submit"
                                        disabled={connectGoogleDrive.isPending}
                                        className="w-full"
                                    >
                                        {connectGoogleDrive.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            'Save Connection'
                                        )}
                                    </Button>
                                </>
                            )}
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Info */}
            <Card className="bg-surface-tonal">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <HardDrive className="h-6 w-6 text-muted-foreground shrink-0" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">About Storage Profiles</p>
                            <p className="mt-1">
                                Storage profiles allow TorreClou to upload downloaded files directly to your cloud storage.
                                Your credentials are encrypted and stored securely.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
