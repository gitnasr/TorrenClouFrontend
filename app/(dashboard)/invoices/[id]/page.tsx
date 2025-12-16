'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    FileText,
    Download,
    Printer,
    Calendar,
    DollarSign,
    HardDrive
} from 'lucide-react'
import { mockInvoices } from '@/lib/mockData'
import { formatCurrency, formatDateTime, formatFileSize } from '@/lib/utils/formatters'
import Link from 'next/link'
import { toast } from 'sonner'

export default function InvoiceDetailPage() {
    const params = useParams()
    const invoiceId = Number(params.id)

    const invoice = mockInvoices.find((i) => i.id === invoiceId) || mockInvoices[0]

    const handleDownload = () => {
        toast.success('Invoice downloaded')
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Invoice #{invoice.id}</h1>
                        <p className="text-muted-foreground">{formatDateTime(invoice.createdAt)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Card */}
            <Card className="print:shadow-none">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b pb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">TorreClou</h2>
                                <p className="text-sm text-muted-foreground">Invoice #{invoice.id}</p>
                            </div>
                        </div>
                        <Badge variant="success" className="text-sm">Paid</Badge>
                    </div>

                    {/* Details */}
                    <div className="grid gap-6 py-6 sm:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Invoice Date
                                </p>
                                <p className="font-medium mt-1">{formatDateTime(invoice.createdAt)}</p>
                            </div>
                            {invoice.jobId && (
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <HardDrive className="h-4 w-4" />
                                        Related Job
                                    </p>
                                    <Link
                                        href={`/torrents/jobs/${invoice.jobId}`}
                                        className="font-medium mt-1 text-primary hover:underline"
                                    >
                                        Job #{invoice.jobId}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">File Size</p>
                                <p className="font-medium mt-1">{formatFileSize(invoice.sizeInBytes)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border-t py-6">
                        <h3 className="font-semibold mb-4">Billing Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Download service ({formatFileSize(invoice.sizeInBytes)})</span>
                                <span>{formatCurrency(invoice.amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg font-semibold">Total Amount</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-medium">Wallet Balance</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className="font-medium text-olive">Completed</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-medium font-mono">TXN-{invoice.walletTransactionId}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
