'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select'

interface PaginationProps {
    totalItems: number
    pageSize: number
    currentPage: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
    pageSizeOptions?: number[]
    className?: string
}

export function Pagination({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50],
    className,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize)

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = []
        const maxVisible = 7

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (currentPage > 3) {
                pages.push('ellipsis')
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-between gap-4 sm:flex-row',
                className
            )}
        >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                    Showing {startItem}-{endItem} of {totalItems}
                </span>
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span>per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                </Button>

                {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <div
                                key={`ellipsis-${index}`}
                                className="flex h-8 w-8 items-center justify-center"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )
                    }

                    return (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            className="h-8 w-8 p-0"
                        >
                            {page}
                        </Button>
                    )
                })}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                </Button>
            </div>
        </div>
    )
}

