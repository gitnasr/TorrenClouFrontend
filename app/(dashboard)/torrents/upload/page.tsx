'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { Upload, ArrowRight, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function TorrentUploadPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please select a torrent file')
            return
        }

        setIsAnalyzing(true)

        // Simulate analysis delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Store file info in sessionStorage for the analyze page
        sessionStorage.setItem('torrentFile', JSON.stringify({
            name: file.name,
            size: file.size,
        }))

        toast.success('Torrent analyzed successfully!')
        router.push('/torrents/analyze')
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Upload Torrent</h1>
                <p className="text-muted-foreground">
                    Upload a .torrent file to get started
                </p>
            </div>

            {/* Upload Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Torrent File
                    </CardTitle>
                    <CardDescription>
                        Upload your .torrent file to analyze and download its contents
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FileUpload
                        accept=".torrent"
                        maxSize={10 * 1024 * 1024}
                        onFileSelect={setFile}
                        selectedFile={file}
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className="w-full"
                        size="lg"
                    >
                        {isAnalyzing ? (
                            'Analyzing...'
                        ) : (
                            <>
                                Analyze Torrent
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex gap-3 pt-6">
                    <Info className="h-5 w-5 shrink-0 text-primary" />
                    <div className="space-y-1 text-sm">
                        <p className="font-medium">How it works</p>
                        <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                            <li>Upload your .torrent file</li>
                            <li>Select the files you want to download</li>
                            <li>Get a quote based on the file size and health</li>
                            <li>Pay and we&apos;ll download it to your cloud storage</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

