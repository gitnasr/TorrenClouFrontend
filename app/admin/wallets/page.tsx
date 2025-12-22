'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal'
import {
    Wallet,
    Search,
    Plus,
    Minus,
    DollarSign,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import { toast } from 'sonner'
import { useAdminWallets, useAdjustBalance } from '@/hooks/useAdminWallet'
import type { AdminWalletDto } from '@/types/wallet'

function WalletListSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right space-y-1">
                                    <Skeleton className="h-7 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-9 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function AdminWalletsPage() {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [showAdjustModal, setShowAdjustModal] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState<AdminWalletDto | null>(null)
    const [adjustmentAmount, setAdjustmentAmount] = useState('')
    const [adjustmentNote, setAdjustmentNote] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const pageSize = 10

    const { data, isLoading, error, refetch } = useAdminWallets({
        pageNumber: currentPage,
        pageSize,
    })

    const adjustBalance = useAdjustBalance()

    // Client-side filtering for search
    const filteredWallets = (data?.items || []).filter((wallet) => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        return (
            wallet.userId.toString().includes(search) ||
            wallet.userEmail.toLowerCase().includes(searchLower) ||
            wallet.userFullName.toLowerCase().includes(searchLower)
        )
    })

    const handleOpenAdjustModal = (wallet: AdminWalletDto) => {
        setSelectedWallet(wallet)
        setAdjustmentAmount('')
        setAdjustmentNote('')
        setShowConfirmation(false)
        setShowAdjustModal(true)
    }

    const handleAdjustBalance = () => {
        if (!adjustmentAmount || isNaN(Number(adjustmentAmount))) {
            toast.error('Please enter a valid amount')
            return
        }

        const amount = Number(adjustmentAmount)
        if (amount === 0) {
            toast.error('Amount cannot be zero')
            return
        }

        if (!adjustmentNote.trim()) {
            toast.error('Description is required')
            return
        }

        if (!showConfirmation) {
            setShowConfirmation(true)
            return
        }

        if (!selectedWallet) return

        adjustBalance.mutate(
            {
                userId: selectedWallet.userId,
                request: {
                    amount,
                    description: adjustmentNote.trim(),
                },
            },
            {
                onSuccess: () => {
                    setShowAdjustModal(false)
                    setShowConfirmation(false)
                },
            }
        )
    }

    const handleCloseModal = () => {
        setShowAdjustModal(false)
        setShowConfirmation(false)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
                <p className="text-muted-foreground mt-1">
                    View and adjust user wallet balances
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by user ID, email, or name..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-destructive">
                                Failed to load wallets. Please try again.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Wallets List */}
            {isLoading ? (
                <WalletListSkeleton />
            ) : filteredWallets.length === 0 ? (
                <EmptyState
                    icon={Wallet}
                    title="No wallets found"
                    description={search ? "Try adjusting your search term" : "No wallets available"}
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredWallets.map((wallet) => (
                                <div
                                    key={wallet.userId}
                                    className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-mint/10 flex items-center justify-center">
                                            <Wallet className="h-5 w-5 text-mint" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{wallet.userFullName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {wallet.userEmail} • {wallet.transactionCount} transactions
                                                {wallet.lastTransactionDate && (
                                                    <span className="hidden sm:inline">
                                                        {' '}• Last: {formatRelativeTime(wallet.lastTransactionDate)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-mint">
                                                {formatCurrency(wallet.balance)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Current Balance</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenAdjustModal(wallet)}
                                        >
                                            <DollarSign className="mr-1 h-4 w-4" />
                                            Adjust
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {data && (
                <Pagination
                    totalItems={data.totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Adjust Balance Modal */}
            <Modal open={showAdjustModal} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>
                            {showConfirmation ? 'Confirm Adjustment' : 'Adjust Balance'}
                        </ModalTitle>
                        <ModalDescription>
                            {showConfirmation ? (
                                <span>
                                    You are about to{' '}
                                    <strong className={Number(adjustmentAmount) >= 0 ? 'text-teal-primary' : 'text-destructive'}>
                                        {Number(adjustmentAmount) >= 0 ? 'credit' : 'debit'} {formatCurrency(Math.abs(Number(adjustmentAmount)))}
                                    </strong>
                                    {' '}to <strong>{selectedWallet?.userFullName}</strong>&apos;s wallet.
                                </span>
                            ) : (
                                `Adjusting wallet for ${selectedWallet?.userFullName} (${selectedWallet?.userEmail})`
                            )}
                        </ModalDescription>
                    </ModalHeader>

                    {!showConfirmation && (
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Amount *</label>
                                <div className="flex gap-2 mt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setAdjustmentAmount(prev =>
                                            prev.startsWith('-') ? prev.slice(1) : prev
                                        )}
                                        className={!adjustmentAmount.startsWith('-') && adjustmentAmount ? 'border-teal-primary' : ''}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setAdjustmentAmount(prev =>
                                            prev.startsWith('-') ? prev : `-${prev}`
                                        )}
                                        className={adjustmentAmount.startsWith('-') ? 'border-destructive' : ''}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use + for credit, - for debit
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description *</label>
                                <Input
                                    placeholder="Reason for adjustment..."
                                    value={adjustmentNote}
                                    onChange={(e) => setAdjustmentNote(e.target.value)}
                                    className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Required for audit purposes
                                </p>
                            </div>
                        </div>
                    )}

                    {showConfirmation && (
                        <div className="py-4">
                            <div className="rounded-lg border p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">User</span>
                                    <span className="font-medium">{selectedWallet?.userFullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Balance</span>
                                    <span className="font-medium">{formatCurrency(selectedWallet?.balance ?? 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Adjustment</span>
                                    <span className={`font-medium ${Number(adjustmentAmount) >= 0 ? 'text-teal-primary' : 'text-destructive'}`}>
                                        {Number(adjustmentAmount) >= 0 ? '+' : ''}{formatCurrency(Number(adjustmentAmount))}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-muted-foreground">New Balance</span>
                                    <span className="font-bold">
                                        {formatCurrency((selectedWallet?.balance ?? 0) + Number(adjustmentAmount))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reason</span>
                                    <span className="font-medium text-right max-w-[200px] truncate">{adjustmentNote}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <ModalFooter>
                        {showConfirmation ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={adjustBalance.isPending}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleAdjustBalance}
                                    disabled={adjustBalance.isPending}
                                    variant={Number(adjustmentAmount) < 0 ? 'destructive' : 'default'}
                                >
                                    {adjustBalance.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Adjustment'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAdjustBalance}>
                                    Review Adjustment
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
