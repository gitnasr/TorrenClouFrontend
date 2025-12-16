'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, FileText, Copy, Check, HardDrive } from 'lucide-react'
import { formatFileSize, formatInfoHash } from '@/lib/utils/formatters'
import { mockTorrentAnalysis, mockTorrentHealth } from '@/lib/mockData'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function TorrentAnalyzePage() {
    const router = useRouter()
    const [selectedFiles, setSelectedFiles] = useState<number[]>([])
    const [copied, setCopied] = useState(false)

    const analysis = mockTorrentAnalysis
    const health = mockTorrentHealth

    // Initialize with all files selected
    useEffect(() => {
        setSelectedFiles(analysis.files.map((f) => f.index))
    }, [analysis.files])

    const handleCopyHash = () => {
        navigator.clipboard.writeText(analysis.infoHash)
        setCopied(true)
        toast.success('Info hash copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleFile = (index: number) => {
        setSelectedFiles((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        )
    }

    const selectAll = () => {
        setSelectedFiles(analysis.files.map((f) => f.index))
    }

    const deselectAll = () => {
        setSelectedFiles([])
    }

    const selectedSize = analysis.files
        .filter((f) => selectedFiles.includes(f.index))
        .reduce((acc, f) => acc + f.size, 0)

    const handleContinue = () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one file')
            return
        }

        sessionStorage.setItem('selectedFiles', JSON.stringify(selectedFiles))
        router.push('/torrents/quote')
    }

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-teal-secondary'
        if (score >= 50) return 'text-warning'
        return 'text-sage'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/torrents/upload">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Torrent Analysis</h1>
                    <p className="text-muted-foreground">Review and select files to download</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Torrent Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {analysis.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span className="font-mono text-xs">{formatInfoHash(analysis.infoHash, 12)}</span>
                                <button onClick={handleCopyHash} className="text-primary hover:text-primary/80">
                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Size</p>
                                    <p className="font-medium">{formatFileSize(analysis.totalSize)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Files</p>
                                    <p className="font-medium">{analysis.files.length} files</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Trackers</p>
                                    <p className="font-medium">{analysis.trackers.length} trackers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Selection */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Select Files</CardTitle>
                                <CardDescription>
                                    Choose which files to download ({selectedFiles.length} of {analysis.files.length} selected)
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={selectAll}>
                                    Select All
                                </Button>
                                <Button variant="outline" size="sm" onClick={deselectAll}>
                                    Deselect All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.files.map((file) => (
                                    <div
                                        key={file.index}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer',
                                            selectedFiles.includes(file.index)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-muted/50'
                                        )}
                                        onClick={() => toggleFile(file.index)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.includes(file.index)}
                                            onChange={() => toggleFile(file.index)}
                                            className="h-4 w-4 rounded border-muted-foreground"
                                        />
                                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{file.path}</p>
                                        </div>
                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Health Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Torrent Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className={cn('text-4xl font-bold', getHealthColor(health.healthScore))}>
                                    {health.healthScore}%
                                </p>
                                <div className="mt-2 flex justify-center gap-2">
                                    {health.isHealthy && <Badge variant="success">Healthy</Badge>}
                                    {health.isWeak && <Badge variant="warning">Weak</Badge>}
                                    {health.isDead && <Badge variant="destructive">Dead</Badge>}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium text-teal-secondary">{health.seeders}</p>
                                    <p className="text-xs text-muted-foreground">Seeders</p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium text-sage">{health.leechers}</p>
                                    <p className="text-xs text-muted-foreground">Leechers</p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="font-medium">{health.completed}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selection Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Selection Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Selected files</span>
                                <span className="font-medium">{selectedFiles.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total size</span>
                                <span className="font-medium">{formatFileSize(selectedSize)}</span>
                            </div>
                            <Button onClick={handleContinue} className="w-full" disabled={selectedFiles.length === 0}>
                                Get Quote
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

