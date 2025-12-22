'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Wallet,
    Receipt,
    Tag,
    Settings,
    Shield,
    FileText,
    Cloud,
} from 'lucide-react'

const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Deposits', href: '/admin/deposits', icon: Receipt },
    { name: 'Wallets', href: '/admin/wallets', icon: Wallet },
    { name: 'Vouchers', href: '/admin/vouchers', icon: Tag },
    { name: 'Sync Jobs', href: '/admin/sync-jobs', icon: Cloud },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r border-border bg-card">
            <div className="flex h-16 items-center border-b border-border px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-plum to-sage">
                    <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-lg font-semibold">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {adminNavigation.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t p-4">
                <Link
                    href="/dashboard"
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <FileText className="mr-3 h-5 w-5" />
                    Back to App
                </Link>
            </div>
        </div>
    )
}

