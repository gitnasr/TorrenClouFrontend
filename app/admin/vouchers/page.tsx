'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    Tag,
    Plus,
    Percent,
    DollarSign,
    Calendar,
    Copy,
    Check
} from 'lucide-react'
import { mockVouchers, paginateData } from '@/lib/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import { DiscountType } from '@/types/enums'
import { toast } from 'sonner'

export default function AdminVouchersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const pageSize = 10

    const paginatedResult = paginateData(mockVouchers, currentPage, pageSize)

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        toast.success('Voucher code copied')
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const handleToggleActive = (id: number) => {
        toast.success('Voucher status updated')
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vouchers</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage discount vouchers and promo codes
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="mr-2 h-5 w-5" />
                    Create Voucher
                </Button>
            </div>

            {/* Vouchers List */}
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Tag}
                    title="No vouchers found"
                    description="Create your first voucher"
                    action={{
                        label: 'Create Voucher',
                        onClick: () => setShowCreateModal(true)
                    }}
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {paginatedResult.items.map((voucher) => (
                                <div
                                    key={voucher.id}
                                    className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-lime/10 flex items-center justify-center">
                                            {voucher.type === DiscountType.Percentage ? (
                                                <Percent className="h-5 w-5 text-lime" />
                                            ) : (
                                                <DollarSign className="h-5 w-5 text-lime" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold font-mono">{voucher.code}</h3>
                                                <button
                                                    onClick={() => handleCopyCode(voucher.code)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    {copiedCode === voucher.code ? (
                                                        <Check className="h-4 w-4 text-mint" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                <span>
                                                    {voucher.type === DiscountType.Percentage
                                                        ? `${voucher.value}% off`
                                                        : `${formatCurrency(voucher.value)} off`
                                                    }
                                                </span>
                                                {voucher.expiresAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        Expires {formatDateTime(voucher.expiresAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {voucher.maxUsesPerUser || 0} / {voucher.maxUsesTotal || '∞'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Max uses</p>
                                        </div>
                                        <Badge variant={voucher.isActive ? 'success' : 'secondary'}>
                                            {voucher.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleActive(voucher.id)}
                                        >
                                            {voucher.isActive ? 'Deactivate' : 'Activate'}
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

            {/* Create Voucher Modal */}
            <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Create Voucher</ModalTitle>
                        <ModalDescription>
                            Create a new discount voucher or promo code.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium">Code</label>
                            <Input placeholder="SUMMER2024" className="mt-1 font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Type</label>
                                <select className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    <option value="Percentage">Percentage</option>
                                    <option value="FixedAmount">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Value</label>
                                <Input type="number" placeholder="10" className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Max Uses</label>
                                <Input type="number" placeholder="100" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Expires At</label>
                                <Input type="date" className="mt-1" />
                            </div>
                        </div>
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            toast.success('Voucher created')
                            setShowCreateModal(false)
                        }}>
                            Create Voucher
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

