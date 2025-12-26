import { Clock, CheckCircle, XCircle } from 'lucide-react'
import type { DepositStatusDto } from '@/types/wallet'
import { ReactNode } from 'react'

export interface DepositStatusConfigItem {
    icon: ReactNode
    badgeVariant: 'default' | 'warning' | 'destructive' | 'success'
    color: string
    description: string
}

export const depositStatusConfig: Record<DepositStatusDto, DepositStatusConfigItem> = {
    'Pending': {
        icon: <Clock className="h-6 w-6" />,
        badgeVariant: 'warning',
        color: 'text-warning',
        description: 'Waiting for payment',
    },
    'Completed': {
        icon: <CheckCircle className="h-6 w-6" />,
        badgeVariant: 'success',
        color: 'text-teal-secondary',
        description: 'Payment received and credited',
    },
    'Failed': {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment failed',
    },
    'Expired': {
        icon: <XCircle className="h-6 w-6" />,
        badgeVariant: 'destructive',
        color: 'text-orange',
        description: 'Payment link expired',
    },
}

export function getDepositStatusConfig(status: DepositStatusDto): DepositStatusConfigItem {
    return depositStatusConfig[status]
}

