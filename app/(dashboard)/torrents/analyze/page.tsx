'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Copy,
    Check,
    Loader2,
    BarChart2,
    Lightbulb,
    File,
    FileText,
    Disc,
    Archive,
    Film,
    Music2,
    ImageIcon,
    Activity,
    ArrowUp,
    ArrowDown,
} from 'lucide-react'
import { formatFileSize, formatInfoHash } from '@/lib/utils/formatters'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { useTorrentStore } from '@/stores/torrentStore'
import { useStartDownload } from '@/hooks/useTorrents'
import { StorageProfileSelector } from '@/components/storage'

function getFileIcon(path: string) {
    const ext = path.split('.').pop()?.toLowerCase() ?? ''
    if (ext === 'pdf')
        return <FileText className="h-[18px] w-[18px] shrink-0 text-red-400" />
    if (['iso', 'img', 'dmg'].includes(ext))
        return <Disc className="h-[18px] w-[18px] shrink-0 text-purple-400" />
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext))
        return <Archive className="h-[18px] w-[18px] shrink-0 text-yellow-400" />
    if (['mp4', 'mkv', 'avi', 'mov'].includes(ext))
        return <Film className="h-[18px] w-[18px] shrink-0 text-blue-400" />
    if (['mp3', 'flac', 'wav'].includes(ext))
        return <Music2 className="h-[18px] w-[18px] shrink-0 text-pink-400" />
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
        return <ImageIcon className="h-[18px] w-[18px] shrink-0 text-green-400" />
    return <File className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
}

export default function TorrentAnalyzePage() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)

    const {
        analysisResult,
        selectedFilePaths,
        toggleFileSelection,
        selectAllFiles,
        deselectAllFiles,
        selectedStorageProfileId,
    } = useTorrentStore()

    const startDownload = useStartDownload()

    useEffect(() => {
        if (!analysisResult) {
            router.push('/torrents/upload')
        }
    }, [analysisResult, router])

    if (!analysisResult) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const health = analysisResult.torrentHealth

    const selectedSize = analysisResult.files
        .filter((f) => selectedFilePaths.includes(f.path))
        .reduce((acc, f) => acc + f.size, 0)

    const handleCopyHash = () => {
        navigator.clipboard.writeText(analysisResult.infoHash)
        setCopied(true)
        toast.success('Info hash copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleStartDownload = () => {
        if (selectedFilePaths.length === 0) {
            toast.error('Please select at least one file')
            return
        }
        if (!selectedStorageProfileId) {
            toast.error('Please select a storage destination')
            return
        }
        startDownload.mutate()
    }

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-primary'
        if (score >= 50) return 'text-warning'
        return 'text-danger'
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/torrents/upload">
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Torrent Analysis</h1>
                    <p className="text-sm text-muted-foreground">Review and select files to download</p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT COLUMN */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Torrent title + hash */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-foreground truncate">
                                {analysisResult.fileName}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs text-muted-foreground">
                                    {formatInfoHash(analysisResult.infoHash, 12)}
                                </span>
                                <button
                                    onClick={handleCopyHash}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {copied
                                        ? <Check className="h-3.5 w-3.5 text-primary" />
                                        : <Copy className="h-3.5 w-3.5" />
                                    }
                                </button>
                                <span className="text-muted-foreground text-xs">·</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatFileSize(analysisResult.totalSizeInBytes)} total
                                </span>
                            </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-primary border-primary/30 bg-primary/10 font-bold text-xs">
                            TORRENT
                        </Badge>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5" /> Health
                            </span>
                            <span className={cn('text-lg font-bold font-mono', getHealthColor(health.healthScore))}>
                                {health.healthScore}%
                            </span>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                                <ArrowUp className="h-3.5 w-3.5" /> Seeders
                            </span>
                            <span className="text-primary text-lg font-bold font-mono">
                                {health.seeders.toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                                <ArrowDown className="h-3.5 w-3.5" /> Leechers
                            </span>
                            <span className="text-warning text-lg font-bold font-mono">
                                {health.leechers.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* File List Card */}
                    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">

                        {/* List Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-muted-foreground">
                                    File Name
                                    <span className="ml-2 text-xs font-normal">
                                        ({selectedFilePaths.length}/{analysisResult.files.length} selected)
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAllFiles}>
                                    Select All
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={deselectAllFiles}>
                                    Deselect All
                                </Button>
                                <span className="text-sm font-semibold text-muted-foreground w-20 text-right">
                                    Size
                                </span>
                            </div>
                        </div>

                        {/* Scrollable file list */}
                        <div className="overflow-y-auto max-h-[500px] p-2 space-y-0.5">
                            {analysisResult.files.map((file) => {
                                const isSelected = selectedFilePaths.includes(file.path)
                                return (
                                    <div
                                        key={file.index}
                                        onClick={() => toggleFileSelection(file.path)}
                                        className={cn(
                                            'flex items-center justify-between px-2 py-2 rounded-lg transition-colors cursor-pointer',
                                            isSelected
                                                ? 'bg-primary/5 border border-primary/10'
                                                : 'border border-transparent hover:bg-white/5'
                                        )}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleFileSelection(file.path)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="h-4 w-4 shrink-0 rounded border-border accent-primary cursor-pointer"
                                            />
                                            {getFileIcon(file.path)}
                                            <span className={cn(
                                                'text-sm truncate',
                                                isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
                                            )}>
                                                {file.path}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            'text-xs font-mono shrink-0 ml-3',
                                            isSelected ? 'text-foreground font-bold' : 'text-muted-foreground'
                                        )}>
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN — Sticky Summary */}
                <div className="w-full md:w-[380px] shrink-0 flex flex-col gap-4 md:sticky md:top-6">

                    {/* Summary Card */}
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5 relative overflow-hidden shadow-lg">
                        {/* Ambient glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative flex flex-col gap-5">
                            <h3 className="text-base font-bold flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-primary" />
                                Job Summary
                            </h3>

                            {/* Key stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Selected Files
                                    </span>
                                    <span className="text-2xl font-bold tracking-tight">
                                        {selectedFilePaths.length}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Total Size
                                    </span>
                                    <span className="text-2xl font-bold tracking-tight font-mono">
                                        {formatFileSize(selectedSize)}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Storage selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-foreground">
                                    Save to Storage
                                </label>
                                <StorageProfileSelector />
                            </div>

                            {/* Start button */}
                            <Button
                                onClick={handleStartDownload}
                                className="w-full"
                                size="lg"
                                disabled={
                                    selectedFilePaths.length === 0 ||
                                    !selectedStorageProfileId ||
                                    startDownload.isPending
                                }
                            >
                                {startDownload.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    'Start Job'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Tip Card */}
                    <div className="bg-card/50 border border-border rounded-xl p-4 flex gap-3 items-start">
                        <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">Smart Selection</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Unselecting non-essential files like READMEs or extras can save bandwidth and storage space.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
