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
    },
    
    // Jobs routes
    jobs: {
        list: '/jobs',
        details: (id: number | string) => `/jobs/${id}`,
    },

    // Storage routes
    storage: {
        profiles: '/storage',
        connect: '/storage/connect',
    },
} as const

// Navigation items for sidebar
export const userNavigation = [
    { name: 'Dashboard', href: routes.dashboard, icon: 'LayoutDashboard' },
    { name: 'Upload Torrent', href: routes.torrents.upload, icon: 'Upload' },
    { name: 'My Jobs', href: routes.jobs.list, icon: 'FolderOpen' },
    { name: 'Storage', href: routes.storage.profiles, icon: 'HardDrive' },
] as const

// Protected routes that require authentication
export const protectedRoutes = [
    '/dashboard',
    '/torrents',
    '/jobs',
    '/storage',
] as const

// Public routes that don't require authentication
export const publicRoutes = [
    '/',
    '/login',
    '/callback',
] as const
