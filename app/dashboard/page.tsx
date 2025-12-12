'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { toast } from 'sonner'
import { Magnet, DollarSign, Play } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { QuoteResponse } from '@/types/api'

export default function DashboardPage() {
  const [magnetLink, setMagnetLink] = useState('')
  const [quote, setQuote] = useState<QuoteResponse | null>(null)

  const quoteMutation = useMutation<QuoteResponse, Error, string>({
    mutationFn: async (magnet: string) => {
      const response = await apiClient.post<QuoteResponse>('/torrents/quote', { magnet })
      return response.data
    },
    onSuccess: (data) => {
      setQuote(data)
      toast.success('Quote calculated successfully')
    },
    onError: () => {
      toast.error('Failed to get quote. Please check your magnet link.')
    },
  })

  const startJobMutation = useMutation<{ jobId: string }, Error, string>({
    mutationFn: async (magnet: string) => {
      const response = await apiClient.post<{ jobId: string }>('/torrents/start', { magnet })
      return response.data
    },
    onSuccess: () => {
      toast.success('Download started! Check My Files for progress.')
      setMagnetLink('')
      setQuote(null)
    },
    onError: () => {
      toast.error('Failed to start download. Please check your balance.')
    },
  })

  const handleGetQuote = () => {
    if (!magnetLink.trim()) {
      toast.error('Please enter a magnet link')
      return
    }
    quoteMutation.mutate(magnetLink)
  }

  const handlePayAndStart = () => {
    if (!magnetLink.trim()) {
      toast.error('Please enter a magnet link')
      return
    }
    startJobMutation.mutate(magnetLink)
  }

  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Paste your magnet link to get started
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Magnet className="h-5 w-5" />
            Magnet Link
          </CardTitle>
          <CardDescription>
            Paste your magnet link or torrent file URL here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="magnet:?xt=urn:btih:..."
              value={magnetLink}
              onChange={(e) => setMagnetLink(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGetQuote}
              disabled={quoteMutation.isPending}
            >
              {quoteMutation.isPending ? 'Calculating...' : 'Get Quote'}
            </Button>
          </div>

          {quoteMutation.isPending && (
            <div className="space-y-2">
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {quote && !quoteMutation.isPending && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Filename</p>
                    <p className="font-medium">{quote.filename}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{formatSize(quote.size)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Health</p>
                    <p className="font-medium">{quote.health}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="text-2xl font-bold text-primary">
                      ${quote.cost.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handlePayAndStart}
                  disabled={startJobMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {startJobMutation.isPending ? (
                    'Starting...'
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Pay & Start
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

