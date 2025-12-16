'use client'

import { useStorageProfiles } from '@/hooks/useStorageProfiles'
import { StorageProfileCard } from './StorageProfileCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { HardDrive, Plus, RefreshCw } from 'lucide-react'
import type { StorageProfilesListProps } from '@/types/storage'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function StorageProfilesList({ className }: StorageProfilesListProps) {
    const { data: profiles, isLoading, error, refetch } = useStorageProfiles()

    if (isLoading) {
        return (
            <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-muted" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-muted rounded" />
                                        <div className="h-3 w-16 bg-muted rounded" />
                                    </div>
                                </div>
                                <div className="h-5 w-16 bg-muted rounded-full" />
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="h-8 w-20 bg-muted rounded" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-danger/50">
                <CardContent className="p-6 text-center">
                    <p className="text-danger mb-4">
                        {error instanceof Error ? error.message : 'Failed to load profiles'}
                    </p>
                    <Button onClick={() => refetch()} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (!profiles || profiles.length === 0) {
        return (
            <EmptyState
                icon={HardDrive}
                title="No storage profiles"
                description="Connect your cloud storage to start downloading files"
                action={{
                    label: 'Add Storage Profile',
                    onClick: () => window.location.href = '/storage/new'
                }}
            />
        )
    }

    return (
        <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
            {profiles.map((profile) => (
                <StorageProfileCard
                    key={profile.id}
                    profile={profile}
                />
            ))}

            {/* Add new profile card */}
            <Link href="/storage/new">
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group h-full">
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[180px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="mt-3 font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            Add Storage Profile
                        </p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
