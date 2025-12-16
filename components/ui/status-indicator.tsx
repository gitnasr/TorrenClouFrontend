'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

import { StatusIndicatorProps } from '@/types/ui'


const statusConfig = {
    pending: {
        dotClass: 'bg-warning',
        textClass: 'text-warning',
        label: 'Pending',
    },
    processing: {
        dotClass: 'bg-primary animate-pulse',
        textClass: 'text-primary',
        label: 'Processing',
    },
    completed: {
        dotClass: 'bg-success',
        textClass: 'text-success',
        label: 'Completed',
    },
    failed: {
        dotClass: 'bg-danger',
        textClass: 'text-danger',
        label: 'Failed',
    },
    cancelled: {
        dotClass: 'bg-surface-100',
        textClass: 'text-surface-50',
        label: 'Cancelled',
    },
    expired: {
        dotClass: 'bg-danger',
        textClass: 'text-danger',
        label: 'Expired',
    },
}

export function StatusIndicator({
    status,
    label,
    showDot = true,
    className,
}: StatusIndicatorProps) {
    const config = statusConfig[status]
    const displayLabel = label || config.label

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {showDot && (
                <span
                    className={cn(
                        'h-2 w-2 rounded-full',
                        config.dotClass
                    )}
                />
            )}
            <span className={cn('text-sm font-medium', config.textClass)}>
                {displayLabel}
            </span>
        </div>
    )
}
