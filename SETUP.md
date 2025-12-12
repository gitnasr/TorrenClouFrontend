# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-a-random-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string generator.

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env`

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Backend API Requirements

Your backend API should implement the following endpoints:

### Authentication
- `POST /api/auth/google-login`
  - Body: `{ id_token: string }`
  - Response: `{ accessToken: string, user: { id, name, email, balance, region } }`

### Wallet
- `GET /api/wallet/balance`
  - Headers: `Authorization: Bearer <backend-token>`
  - Response: `{ balance: number }`

- `GET /api/wallet/transactions`
  - Headers: `Authorization: Bearer <backend-token>`
  - Response: `Transaction[]`

### Torrents
- `POST /api/torrents/quote`
  - Headers: `Authorization: Bearer <backend-token>`
  - Body: `{ magnet: string }`
  - Response: `{ cost: number, size: number, health: number, filename: string }`

- `POST /api/torrents/start`
  - Headers: `Authorization: Bearer <backend-token>`
  - Body: `{ magnet: string }`
  - Response: `{ jobId: string }`

- `GET /api/torrents/jobs`
  - Headers: `Authorization: Bearer <backend-token>`
  - Response: `TorrentJob[]`

- `DELETE /api/torrents/jobs/:id`
  - Headers: `Authorization: Bearer <backend-token>`

- `POST /api/torrents/jobs/:id/retry`
  - Headers: `Authorization: Bearer <backend-token>`

## TypeScript Types

The frontend expects these types from the backend:

```typescript
interface TorrentJob {
  id: string
  filename: string
  size: number
  status: 'Downloading' | 'Uploading' | 'Completed' | 'Failed'
  progress: number
  createdAt: string
}

interface Transaction {
  id: string
  type: 'Deposit' | 'Payment' | 'Refund'
  amount: number
  description: string
  createdAt: string
}
```

## Troubleshooting

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Verify Google OAuth credentials are correct
- Check that redirect URI matches in Google Console

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is running

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

