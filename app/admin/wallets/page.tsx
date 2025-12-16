'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
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
    DollarSign
} from 'lucide-react'
import { mockAdminWallets, paginateData } from '@/lib/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import { toast } from 'sonner'

export default function AdminWalletsPage() {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [showAdjustModal, setShowAdjustModal] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState<number | null>(null)
    const [adjustmentAmount, setAdjustmentAmount] = useState('')
    const [adjustmentNote, setAdjustmentNote] = useState('')
    const pageSize = 10

    const filteredWallets = mockAdminWallets.filter((wallet) => {
        return !search ||
            wallet.userId.toString().includes(search) ||
            wallet.userEmail.toLowerCase().includes(search.toLowerCase())
    })

    const paginatedResult = paginateData(filteredWallets, currentPage, pageSize)

    const handleOpenAdjustModal = (userId: number) => {
        setSelectedWallet(userId)
        setAdjustmentAmount('')
        setAdjustmentNote('')
        setShowAdjustModal(true)
    }

    const handleAdjustBalance = () => {
        if (!adjustmentAmount || isNaN(Number(adjustmentAmount))) {
            toast.error('Please enter a valid amount')
            return
        }
        toast.success(`Balance adjusted by ${formatCurrency(Number(adjustmentAmount))}`)
        setShowAdjustModal(false)
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
                            placeholder="Search by user ID or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Wallets List */}
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Wallet}
                    title="No wallets found"
                    description="Try adjusting your search term"
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {paginatedResult.items.map((wallet) => (
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
                                            onClick={() => handleOpenAdjustModal(wallet.userId)}
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
            <Pagination
                totalItems={paginatedResult.totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            {/* Adjust Balance Modal */}
            <Modal open={showAdjustModal} onOpenChange={setShowAdjustModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Adjust Balance</ModalTitle>
                        <ModalDescription>
                            Enter a positive or negative amount to adjust the wallet balance.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium">Amount</label>
                            <div className="flex gap-2 mt-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAdjustmentAmount(prev =>
                                        prev.startsWith('-') ? prev.slice(1) : prev
                                    )}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAdjustmentAmount(prev =>
                                        prev.startsWith('-') ? prev : `-${prev}`
                                    )}
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
                        </div>
                        <div>
                            <label className="text-sm font-medium">Note (optional)</label>
                            <Input
                                placeholder="Reason for adjustment..."
                                value={adjustmentNote}
                                onChange={(e) => setAdjustmentNote(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowAdjustModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdjustBalance}>
                            Apply Adjustment
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

