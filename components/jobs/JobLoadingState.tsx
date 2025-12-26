'use client'

import { LoadingState } from '@/components/shared'

interface JobLoadingStateProps {
    message?: string
}

export function JobLoadingState({ message = 'Loading job details...' }: JobLoadingStateProps) {
    return <LoadingState message={message} />
}

