'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from 'next-auth/react'
import { Zap, Shield, Globe, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Download Torrents
            <span className="block text-primary">Directly to Your Drive</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Seamlessly transfer torrents to your Google Drive with our
            high-speed, secure service. No downloads, no storage limits.
          </p>
          <Button
            size="lg"
            className="text-lg"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Start for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Globe className="mb-4 h-12 w-12 text-primary" />
              <CardTitle>Regional Pricing</CardTitle>
              <CardDescription>
                Dynamic pricing based on your region for the best value
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="mb-4 h-12 w-12 text-primary" />
              <CardTitle>High Speed</CardTitle>
              <CardDescription>
                Lightning-fast downloads and uploads to your cloud storage
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="mb-4 h-12 w-12 text-primary" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Your data is encrypted and secure throughout the process
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}

