'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
    message?: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
}

export function LoadingState({ 
    message, 
    className,
    size = 'md' 
}: LoadingStateProps) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center min-h-[400px]',
            className
        )}>
            <Loader2 className={cn(
                'animate-spin text-muted-foreground mb-4',
                sizeClasses[size]
            )} />
            {message && (
                <p className="text-muted-foreground text-sm">{message}</p>
            )}
        </div>
    )
}

