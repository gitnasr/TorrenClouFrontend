import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                <Topbar />
                <main className="flex-1 overflow-auto bg-background p-6 min-h-0">
                    {children}
                </main>
            </div>
        </div>
    )
}

