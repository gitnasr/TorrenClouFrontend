import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactQueryProvider } from '@/lib/react-query'
import { NextAuthSessionProvider } from '@/components/providers/session-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TorrenClou - Torrent to Cloud',
  description: 'Download torrents directly to your Google Drive',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextAuthSessionProvider>
            <ReactQueryProvider>
              {children}
              <Toaster position="top-right" richColors />
            </ReactQueryProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

