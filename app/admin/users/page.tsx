'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import {
    Users,
    Search,
    Mail,
    Calendar,
    DollarSign,
    MoreVertical
} from 'lucide-react'
import { mockUsers, paginateData } from '@/lib/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import Link from 'next/link'

export default function AdminUsersPage() {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const filteredUsers = mockUsers.filter((user) => {
        return !search ||
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase())
    })

    const paginatedResult = paginateData(filteredUsers, currentPage, pageSize)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground mt-1">
                    Manage registered users
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
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

            {/* Users List */}
            {paginatedResult.items.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No users found"
                    description="Try adjusting your search term"
                />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {paginatedResult.items.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-primary">
                                                {user.name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{user.name || 'Unknown'}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {user.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDateTime(user.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(user.balance)}</p>
                                            <p className="text-xs text-muted-foreground">Balance</p>
                                        </div>
                                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
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
        </div>
    )
}

