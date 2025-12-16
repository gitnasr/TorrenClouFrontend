import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import GoogleLoginButton from '@/components/auth/google-login-button'
import { FileText } from 'lucide-react'

export default async function LoginPage() {
    // Check if user is already authenticated
    const session = await auth()
    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-primary/20 via-background to-teal-secondary/20">
            <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-2xl">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-teal-primary to-teal-secondary">
                        <FileText className="h-8 w-8 text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-bold">TorreClou</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        Download torrents directly to your cloud storage
                    </p>
                </div>

                {/* Welcome Message */}
                <div className="space-y-2 text-center">
                    <h2 className="text-xl font-semibold">Welcome back</h2>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Google Login Button */}
                <GoogleLoginButton />

                {/* Terms */}
                <p className="text-center text-xs text-muted-foreground">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    )
}

