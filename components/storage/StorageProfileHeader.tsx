'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { StorageProfile } from '@/types/storage'

interface StorageProfileHeaderProps {
    profile: StorageProfile
    backHref?: string
}

export function StorageProfileHeader({ 
    profile, 
    backHref = '/storage' 
}: StorageProfileHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
                <Link href={backHref}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Link>
            </Button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.profileName}</h1>
                <p className="text-muted-foreground">Manage storage profile settings</p>
            </div>
        </div>
    )
}



