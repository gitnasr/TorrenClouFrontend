'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { getStorageErrorMessage } from '@/types/storage'
import Link from 'next/link'

type CallbackStatus = 'processing' | 'success' | 'error'

function CallbackContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<CallbackStatus>('processing')
    const [profileId, setProfileId] = useState<number | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        // Backend redirects to /storage?success=true&profileId=123 or /storage?error=...
        // If popup lands here, redirect to /storage with the params
        const success = searchParams.get('success')
        const error = searchParams.get('error')
        const profileIdParam = searchParams.get('profileId')
        const message = searchParams.get('message')

        // If we have success/error params, show appropriate state
        if (success === 'true' && profileIdParam) {
            setStatus('success')
            setProfileId(parseInt(profileIdParam, 10))
            return
        }

        if (error || message) {
            setStatus('error')
            setErrorMessage(getStorageErrorMessage(error || 'UNKNOWN_ERROR', message || 'Connection failed'))
            return
        }

        // If no params, this is an invalid callback
        setStatus('error')
        setErrorMessage('Invalid callback. Missing required parameters.')
    }, [searchParams])

    // Auto-close popup after success (if in popup)
    useEffect(() => {
        if (status === 'success' && window.opener) {
            // This is a popup - will be handled by the parent window
            // The parent is polling and will detect the redirect
            return
        }
    }, [status])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardContent className="pt-8 pb-8 text-center space-y-6">
                    {status === 'processing' && (
                        <>
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Connecting Google Drive</h2>
                                <p className="text-muted-foreground mt-2">
                                    Please wait while we complete the connection...
                                </p>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-success" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-success">Connected Successfully!</h2>
                                <p className="text-muted-foreground mt-2">
                                    Your Google Drive account has been connected.
                                </p>
                                {profileId && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Profile ID: {profileId}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button asChild>
                                    <Link href="/storage">
                                        View Storage Profiles
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/torrents/upload">Upload a Torrent</Link>
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center">
                                    <XCircle className="h-8 w-8 text-danger" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-danger">Connection Failed</h2>
                                <p className="text-muted-foreground mt-2">
                                    {errorMessage}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button asChild>
                                    <Link href="/storage/new">Try Again</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/storage">Back to Storage</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function StorageCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-8 pb-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Loading...</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    )
}
