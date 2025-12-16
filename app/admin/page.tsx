'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart } from '@/components/ui/chart'
import {
    Users,
    DollarSign,
    Download,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { mockAdminDashboardAnalytics } from '@/lib/mockData'

export default function AdminDashboardPage() {
    const analytics = mockAdminDashboardAnalytics

    // Mock chart data
    const revenueChartData = [
        { label: 'Jan', value: 12500 },
        { label: 'Feb', value: 15200 },
        { label: 'Mar', value: 18900 },
        { label: 'Apr', value: 22100 },
        { label: 'May', value: 19800 },
        { label: 'Jun', value: 25600 },
    ]

    const downloadsChartData = [
        { label: 'Mon', value: 120 },
        { label: 'Tue', value: 145 },
        { label: 'Wed', value: 189 },
        { label: 'Thu', value: 165 },
        { label: 'Fri', value: 198 },
        { label: 'Sat', value: 210 },
        { label: 'Sun', value: 175 },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Overview of platform metrics and activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-3xl font-bold mt-1">{analytics.totalUsers.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-mint">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span>+12.5% this month</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-3xl font-bold mt-1">{formatCurrency(analytics.totalRevenue)}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-mint">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span>+8.2% this month</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-mint/10 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-mint" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Deposits</p>
                                <p className="text-3xl font-bold mt-1">{analytics.pendingDeposits}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-lime">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Requires attention</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-lime/10 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-lime" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                                <p className="text-3xl font-bold mt-1">{analytics.activeJobs}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm text-sage">
                                    <Download className="h-6 w-6" />
                                    <span>Processing now</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-sage/10 flex items-center justify-center">
                                <Download className="h-6 w-6 text-sage" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Chart type="bar" data={revenueChartData} height={300} fillColor="#8A8635" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Downloads This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Chart type="line" data={downloadsChartData} height={300} strokeColor="#CC561E" />
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Total Jobs Completed</p>
                        <p className="text-2xl font-bold mt-1">{analytics.totalJobsCompleted.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Active Vouchers</p>
                        <p className="text-2xl font-bold mt-1">{analytics.activeVouchers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Storage Used</p>
                        <p className="text-2xl font-bold mt-1">{(analytics.totalStorageUsedGb).toFixed(1)} GB</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

