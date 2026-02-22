'use client'

import { Separator } from '@/components/ui/separator'
import { OAuthCredentialsList } from './OAuthCredentialsList'
import { OAuthCredentialsForm } from './OAuthCredentialsForm'
import { GoogleDriveConnectForm } from './GoogleDriveConnectForm'

interface GoogleDriveConfigFormProps {
    onSuccess?: () => void
}

/**
 * Google Drive Setup — composes three sections:
 * 1. Saved Credentials list
 * 2. Add New Credentials form (expandable)
 * 3. Connect a Drive Account form
 */
export function GoogleDriveConfigForm({ onSuccess }: GoogleDriveConfigFormProps) {
    return (
        <div className="space-y-6">
            {/* Section A: Saved Credentials */}
            <div>
                <h3 className="text-sm font-semibold mb-3">Saved OAuth Credentials</h3>
                <OAuthCredentialsList />
                <OAuthCredentialsForm className="mt-3" />
            </div>

            <Separator />

            {/* Section B: Connect a Drive Account */}
            <div>
                <h3 className="text-sm font-semibold mb-3">Connect a Google Drive Account</h3>
                <GoogleDriveConnectForm onSuccess={onSuccess} />
            </div>
        </div>
    )
}
