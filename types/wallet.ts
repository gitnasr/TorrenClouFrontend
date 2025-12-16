import { WalletTransaction } from '@/types/api'

export interface TransactionListProps {
    transactions: WalletTransaction[]
    limit?: number
    showViewAll?: boolean
    className?: string
}

export interface BalanceCardProps {
    balance: number
    changeAmount?: number
    changePercentage?: number
    showActions?: boolean
    className?: string
}
