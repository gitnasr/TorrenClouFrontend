import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

