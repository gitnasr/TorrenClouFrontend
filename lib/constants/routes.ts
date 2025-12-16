// Route constants for navigation
export const routes = {
    // Public routes
    home: '/',
    login: '/login',
    callback: '/callback',

    // User dashboard routes
    dashboard: '/dashboard',

    // Torrent routes
    torrents: {
        upload: '/torrents/upload',
        analyze: '/torrents/analyze',
        quote: '/torrents/quote',
        jobs: '/torrents/jobs',
        jobDetails: (id: number | string) => `/torrents/jobs/${id}`,
    },

    // Wallet routes
    wallet: {
        overview: '/wallet',
        transactions: '/wallet/transactions',
        transactionDetails: (id: number | string) => `/wallet/transactions/${id}`,
        deposits: '/wallet/deposits',
        newDeposit: '/wallet/deposits/new',
        depositDetails: (id: number | string) => `/wallet/deposits/${id}`,
    },

    // Storage routes
    storage: {
        profiles: '/storage',
        connect: '/storage/connect',
    },

    // Invoice routes
    invoices: {
        list: '/invoices',
        details: (id: number | string) => `/invoices/${id}`,
    },

    // Admin routes
    admin: {
        dashboard: '/admin/dashboard',
        deposits: '/admin/payments/deposits',
        wallets: '/admin/payments/wallets',
        transactions: '/admin/payments/transactions',
        analytics: '/admin/payments/analytics',
    },
} as const

// Navigation items for sidebar
export const userNavigation = [
    { name: 'Dashboard', href: routes.dashboard, icon: 'LayoutDashboard' },
    { name: 'Upload Torrent', href: routes.torrents.upload, icon: 'Upload' },
    { name: 'My Jobs', href: routes.torrents.jobs, icon: 'FolderOpen' },
    { name: 'Wallet', href: routes.wallet.overview, icon: 'Wallet' },
    { name: 'Storage', href: routes.storage.profiles, icon: 'HardDrive' },
    { name: 'Invoices', href: routes.invoices.list, icon: 'FileText' },
] as const

export const adminNavigation = [
    { name: 'Dashboard', href: routes.admin.dashboard, icon: 'LayoutDashboard' },
    { name: 'Deposits', href: routes.admin.deposits, icon: 'DollarSign' },
    { name: 'Wallets', href: routes.admin.wallets, icon: 'Wallet' },
    { name: 'Transactions', href: routes.admin.transactions, icon: 'Receipt' },
    { name: 'Analytics', href: routes.admin.analytics, icon: 'BarChart3' },
] as const

// Protected routes that require authentication
export const protectedRoutes = [
    '/dashboard',
    '/torrents',
    '/wallet',
    '/storage',
    '/invoices',
    '/admin',
] as const

// Public routes that don't require authentication
export const publicRoutes = [
    '/',
    '/login',
    '/callback',
] as const
