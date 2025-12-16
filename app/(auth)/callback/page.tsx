'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check for error in URL params
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (errorParam) {
            setStatus('error')
            setError(errorDescription || 'Authentication failed. Please try again.')
            return
        }

        // Simulate callback processing
        const timer = setTimeout(() => {
            // In a real app, NextAuth handles this automatically
            // This is for demonstration of the UI states
            setStatus('success')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        }, 1500)

        return () => clearTimeout(timer)
    }, [searchParams, router])

    const handleRetry = () => {
        router.push('/login')
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>
                    {status === 'loading' && 'Completing Sign In'}
                    {status === 'success' && 'Welcome!'}
                    {status === 'error' && 'Sign In Failed'}
                </CardTitle>
                <CardDescription>
                    {status === 'loading' && 'Please wait while we complete your sign in...'}
                    {status === 'success' && 'Redirecting you to the dashboard...'}
                    {status === 'error' && 'There was a problem signing you in.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {status === 'loading' && (
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                )}

                {status === 'success' && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-secondary/20">
                        <CheckCircle className="h-8 w-8 text-teal-secondary" />
                    </div>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20">
                            <AlertCircle className="h-8 w-8 text-sage" />
                        </div>
                        {error && (
                            <p className="text-center text-sm text-muted-foreground">{error}</p>
                        )}
                        <Button onClick={handleRetry} className="w-full">
                            Try Again
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

function CallbackLoading() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Completing Sign In</CardTitle>
                <CardDescription>Please wait while we complete your sign in...</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
        </Card>
    )
}

export default function CallbackPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-primary/20 via-background to-teal-secondary/20">
            <Suspense fallback={<CallbackLoading />}>
                <CallbackContent />
            </Suspense>
        </div>
    )
}

