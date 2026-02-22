'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Key, Calendar, ExternalLink } from 'lucide-react'
import { useOAuthCredentials } from '@/hooks/useStorageProfiles'
import type { OAuthCredential } from '@/types/storage'

function CredentialCard({ credential }: { credential: OAuthCredential }) {
    const createdDate = new Date(credential.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    return (
        <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Key className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{credential.name}</h4>
                <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                    {credential.clientIdMasked}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {createdDate}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{credential.redirectUri}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

function CredentialsListSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-56" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
            ))}
        </div>
    )
}

interface OAuthCredentialsListProps {
    className?: string
}

export function OAuthCredentialsList({ className }: OAuthCredentialsListProps) {
    const { data: credentials, isLoading, error } = useOAuthCredentials()

    if (isLoading) {
        return (
            <div className={className}>
                <CredentialsListSkeleton />
            </div>
        )
    }

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-4">
                    <p className="text-sm text-danger">Failed to load credentials.</p>
                </CardContent>
            </Card>
        )
    }

    if (!credentials || credentials.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="p-6 text-center">
                    <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        No OAuth credentials saved yet. Add your Google Cloud OAuth credentials to start connecting Drive accounts.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className={className}>
            <div className="space-y-3">
                {credentials.map((credential) => (
                    <CredentialCard key={credential.id} credential={credential} />
                ))}
            </div>
        </div>
    )
}
