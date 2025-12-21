# TorrenClou Frontend - Backend Integration Specification

This document provides a comprehensive overview of the TorrenClou frontend application, its tech stack, features, and API requirements for backend integration.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Features & Capabilities](#features--capabilities)
4. [API Endpoints Required](#api-endpoints-required)
5. [Authentication Flow](#authentication-flow)
6. [Data Models & Types](#data-models--types)
7. [Environment Variables](#environment-variables)
8. [Key Integrations](#key-integrations)

---

## 🚀 Tech Stack

### Core Framework
- **Next.js 15** (App Router) - React framework with Server Components
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Avatar, Dialog, Dropdown, Progress, Select, Tabs, Toast, Tooltip, etc.)
- **Lucide React** - Icon library
- **next-themes** - Dark/light mode support
- **Sonner** - Toast notifications

### State Management & Data Fetching
- **TanStack Query (React Query) 5.56.2** - Server state management, caching, and synchronization
- **Zustand 5.0.9** - Client-side state management
- **Axios 1.7.7** - HTTP client with interceptors

### Forms & Validation
- **React Hook Form 7.68.0** - Form handling
- **Zod 4.1.13** - Schema validation
- **@hookform/resolvers** - Zod integration for React Hook Form

### Authentication
- **NextAuth.js v5 (Auth.js)** - Authentication with Google OAuth provider

### Utilities
- **date-fns 4.1.0** - Date formatting and manipulation
- **recharts 3.5.1** - Charting library
- **class-variance-authority** - Component variant styling
- **clsx & tailwind-merge** - Conditional class utilities

---

## 📁 Project Structure

```
TorrenClouFrontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes (route groups)
│   │   ├── callback/             # OAuth callback handler
│   │   └── login/                # Login page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── invoices/             # Invoice management
│   │   │   ├── [id]/            # Invoice detail page
│   │   │   └── page.tsx         # Invoice list
│   │   ├── storage/              # Storage profile management
│   │   │   ├── [id]/            # Storage profile detail
│   │   │   ├── callback/        # OAuth callback for storage
│   │   │   ├── new/             # Create new storage profile
│   │   │   └── page.tsx         # Storage profiles list
│   │   ├── torrents/             # Torrent operations
│   │   │   ├── analyze/         # Torrent analysis page
│   │   │   ├── jobs/            # Job management
│   │   │   │   ├── [id]/        # Job detail page
│   │   │   │   └── page.tsx     # Jobs list
│   │   │   └── upload/          # Upload torrent page
│   │   └── wallet/               # Wallet management
│   │       ├── deposits/        # Deposit management
│   │       │   ├── [id]/        # Deposit detail
│   │       │   ├── new/         # Create deposit
│   │       │   └── page.tsx     # Deposits list
│   │       ├── transactions/    # Transaction history
│   │       └── page.tsx         # Wallet overview
│   ├── admin/                    # Admin panel routes
│   │   ├── deposits/            # Admin deposit management
│   │   ├── users/               # User management
│   │   ├── vouchers/            # Voucher management
│   │   ├── wallets/             # Wallet management
│   │   ├── layout.tsx           # Admin layout
│   │   └── page.tsx             # Admin dashboard
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth API routes
│   │       └── [...nextauth]/   # NextAuth handler
│   ├── dashboard/                # Legacy dashboard routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # React components
│   ├── auth/                     # Authentication components
│   ├── jobs/                     # Job-related components
│   ├── layout/                   # Layout components (sidebar, topbar)
│   ├── providers/                # Context providers
│   ├── storage/                  # Storage profile components
│   ├── ui/                       # Reusable UI components (shadcn/ui)
│   └── wallet/                   # Wallet components
├── hooks/                         # Custom React hooks
│   ├── useInvoices.ts
│   ├── useJobs.ts
│   ├── usePayments.ts
│   ├── useStorageProfiles.ts
│   └── useTorrents.ts
├── lib/                           # Utilities and configurations
│   ├── api/                      # API client functions
│   │   ├── invoices.ts
│   │   ├── jobs.ts
│   │   ├── payments.ts
│   │   ├── storage.ts
│   │   └── torrents.ts
│   ├── constants/                # Constants
│   │   ├── colors.ts
│   │   └── routes.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── axios.ts                  # Axios instance with interceptors
│   ├── react-query.tsx           # TanStack Query provider
│   └── utils.ts                  # General utilities
├── stores/                        # Zustand state stores
│   ├── invoicesStore.ts
│   ├── jobsStore.ts
│   ├── storageProfilesStore.ts
│   └── torrentStore.ts
├── types/                         # TypeScript type definitions
│   ├── api.ts                    # API response types
│   ├── auth.ts                   # Authentication types
│   ├── enums.ts                  # Enum definitions
│   ├── invoices.ts
│   ├── jobs.ts
│   ├── storage.ts
│   ├── torrents.ts
│   └── wallet.ts
├── auth.config.ts                 # NextAuth configuration
├── auth.ts                        # NextAuth exports
├── middleware.ts                  # Route protection middleware
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## 🎯 Features & Capabilities

### User Features

1. **Authentication**
   - Google OAuth login
   - Session management via NextAuth
   - Protected routes with middleware

2. **Torrent Management**
   - Upload and analyze `.torrent` files
   - View torrent information (files, trackers, health metrics)
   - Get pricing quotes with file selection
   - Apply voucher codes for discounts
   - View job progress and status
   - Job filtering and pagination

3. **Wallet System**
   - View current balance
   - Transaction history
   - Create deposits (crypto/stablecoin)
   - View deposit status
   - Real-time balance updates

4. **Storage Profiles**
   - Connect Google Drive accounts
   - Manage multiple storage profiles
   - Set default storage profile
   - Disconnect storage profiles
   - OAuth popup flow for Google Drive

5. **Invoices**
   - View invoice list with pagination
   - Invoice details
   - Pay invoices from wallet
   - Invoice statistics
   - Date filtering

6. **Jobs**
   - View all user jobs with pagination
   - Job details with progress tracking
   - Filter by status
   - Job statistics (total, active, completed, failed)

### Admin Features

1. **Dashboard**
   - Overview statistics
   - Deposit analytics (daily, weekly, monthly)
   - Wallet balance summaries

2. **Deposit Management**
   - View all deposits
   - Filter by status
   - Deposit details

3. **User Management**
   - View all users
   - User details

4. **Wallet Management**
   - View all user wallets
   - Adjust balances
   - Transaction history

5. **Voucher Management**
   - View and manage vouchers

---

## 🔌 API Endpoints Required

### Base URL
- Configured via `NEXT_PUBLIC_API_URL` environment variable
- Default: `http://localhost:5000/api`
- All requests include `Authorization: Bearer <backend-token>` header (except public endpoints)

### Authentication

#### `POST /api/auth/google-login`
**Public endpoint** - No auth required
- **Request Body:**
  ```json
  {
    "idToken": "string",
    "provider": "google"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "string",
    "user": {
      "id": "string",
      "name": "string | null",
      "email": "string | null",
      "image": "string | null",
      "balance": "number",
      "region": "string"
    }
  }
  ```

### Torrents

#### `POST /api/torrents/analyze/file`
**Public endpoint** - No auth required
- **Request:** `multipart/form-data`
  - `file`: `.torrent` file
- **Response:** `TorrentInfo` (see Data Models)

#### `POST /api/torrents/quote`
**Authenticated**
- **Request:** `multipart/form-data`
  - `torrentFile`: `.torrent` file
  - `selectedFileIndices`: `number[]` (array of file indices)
  - `voucherCode`: `string` (optional)
- **Response:** `QuoteResponse` (see Data Models)

### Jobs

#### `GET /api/jobs`
**Authenticated** - Get paginated jobs
- **Query Parameters:**
  - `pageNumber`: `number` (optional)
  - `pageSize`: `number` (optional)
  - `status`: `JobStatus` enum (optional)
- **Response:** `PaginatedJobs` (see Data Models)

#### `GET /api/jobs/:id`
**Authenticated** - Get job by ID
- **Response:** `Job` (see Data Models)

#### `GET /api/jobs/statistics`
**Authenticated** - Get job statistics
- **Response:** `JobStatistics` (see Data Models)

### Payments & Wallet

#### `GET /api/payments/wallet/balance`
**Authenticated**
- **Response:**
  ```json
  {
    "balance": "number",
    "currency": "string"
  }
  ```

#### `POST /api/invoices/pay?invoiceId={id}`
**Authenticated** - Pay invoice from wallet
- **Response:** `InvoicePaymentResult` (see Data Models)

### Storage

#### `GET /api/storage/gdrive/connect?profileName={name}`
**Authenticated** - Get Google Drive OAuth URL
- **Query Parameters:**
  - `profileName`: `string` (optional, 3-50 characters)
- **Response:**
  ```json
  {
    "authorizationUrl": "string"
  }
  ```

#### `GET /api/storage/profiles`
**Authenticated** - Get all storage profiles
- **Response:** `StorageProfile[]` (see Data Models)

#### `GET /api/storage/profiles/:id`
**Authenticated** - Get storage profile by ID
- **Response:** `StorageProfileDetail` (see Data Models)

#### `POST /api/storage/profiles/:id/set-default`
**Authenticated** - Set default storage profile

#### `POST /api/storage/profiles/:id/disconnect`
**Authenticated** - Disconnect storage profile

### Invoices

#### `GET /api/invoices`
**Authenticated** - Get paginated invoices
- **Query Parameters:**
  - `pageNumber`: `number` (optional)
  - `pageSize`: `number` (optional)
  - `dateFrom`: `string` (ISO date, optional)
  - `dateTo`: `string` (ISO date, optional)
- **Response:** `PaginatedInvoices` (see Data Models)

#### `GET /api/invoices/:id`
**Authenticated** - Get invoice by ID
- **Response:** `Invoice` (see Data Models)

#### `GET /api/invoices/statistics`
**Authenticated** - Get invoice statistics
- **Response:** `InvoiceStatistics` (see Data Models)

### Admin Endpoints

#### `GET /api/admin/dashboard`
**Authenticated** - Admin role required
- **Response:** `AdminDashboard` (see Data Models)

#### `GET /api/admin/deposits`
**Authenticated** - Admin role required
- **Response:** `AdminDeposit[]` (see Data Models)

#### `GET /api/admin/wallets`
**Authenticated** - Admin role required
- **Response:** `AdminWallet[]` (see Data Models)

#### `POST /api/admin/wallets/:userId/adjust-balance`
**Authenticated** - Admin role required
- **Request Body:**
  ```json
  {
    "amount": "number",
    "description": "string"
  }
  ```

---

## 🔐 Authentication Flow

1. **User clicks "Login with Google"** on the landing page
2. **NextAuth handles Google OAuth** flow
3. **In `signIn` callback:**
   - Google `id_token` is sent to backend: `POST /api/auth/google-login`
   - Backend validates token and returns:
     - `accessToken`: Backend JWT token
     - `user`: User data (id, name, email, balance, region)
4. **Backend token stored in NextAuth session:**
   - Token stored in JWT callback
   - Available in session as `session.backendToken`
5. **Axios interceptor automatically attaches token:**
   - All API requests include: `Authorization: Bearer <backend-token>`
   - 401 responses redirect to login

### Session Structure
```typescript
{
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    balance?: number
    region?: string
  }
  backendToken: string
}
```

---

## 📊 Data Models & Types

### Enums

```typescript
enum RegionCode {
  Global = "Global"
  US = "US"
  EU = "EU"
  EG = "EG"
  SA = "SA"
  IN = "IN"
}

enum UserRole {
  User = "User"
  Admin = "Admin"
  Support = "Support"
}

enum StorageProviderType {
  GoogleDrive = "GoogleDrive"
  OneDrive = "OneDrive"
  AwsS3 = "AwsS3"
  Dropbox = "Dropbox"
}

enum TransactionType {
  DEPOSIT = "DEPOSIT"
  PAYMENT = "PAYMENT"
  REFUND = "REFUND"
  ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT"
  BONUS = "BONUS"
  DEDUCTION = "DEDUCTION"
}

enum JobStatus {
  QUEUED = "QUEUED"
  DOWNLOADING = "DOWNLOADING"
  SYNCING = "SYNCING"
  PENDING_UPLOAD = "PENDING_UPLOAD"
  UPLOADING = "UPLOADING"
  RETRYING = "RETRYING"
  TORRENT_DOWNLOAD_RETRY = "TORRENT_DOWNLOAD_RETRY"
  UPLOAD_RETRY = "UPLOAD_RETRY"
  SYNC_RETRY = "SYNC_RETRY"
  COMPLETED = "COMPLETED"
  FAILED = "FAILED"
  CANCELLED = "CANCELLED"
  TORRENT_FAILED = "TORRENT_FAILED"
  UPLOAD_FAILED = "UPLOAD_FAILED"
  GOOGLE_DRIVE_FAILED = "GOOGLE_DRIVE_FAILED"
}

enum JobType {
  Torrent = "Torrent"
  Other = "Other"
}

enum DepositStatus {
  Pending = "Pending"
  Completed = "Completed"
  Failed = "Failed"
  Expired = "Expired"
}

enum DiscountType {
  Percentage = "Percentage"
  FixedAmount = "FixedAmount"
}
```

### Key Data Models

#### TorrentInfo
```typescript
{
  infoHash: string
  name: string
  totalSize: number
  files: Array<{
    index: number
    path: string
    size: number
  }>
  trackers: string[]
  scrapeResult: {
    seeders: number
    leechers: number
    completed: number
    trackersSuccess: number
    trackersTotal: number
  }
}
```

#### QuoteResponse
```typescript
{
  isReadyToDownload: boolean
  originalAmountInUSD: number
  finalAmountInUSD: number
  finalAmountInNCurrency: number
  torrentHealth: {
    seeders: number
    leechers: number
    completed: number
    seederRatio: number
    isComplete: boolean
    isDead: boolean
    isWeak: boolean
    isHealthy: boolean
    healthScore: number
  }
  fileName: string
  sizeInBytes: number
  isCached: boolean
  infoHash: string
  message?: string
  pricingDetails: {
    totalSizeInBytes: number
    totalSizeInGb: number
    selectedFiles: number[]
    baseRatePerGb: number
    userRegion: string
    regionMultiplier: number
    healthMultiplier: number
    isCacheHit: boolean
    cacheDiscountAmount: number
    finalPrice: number
    calculatedAt: string
  }
  invoiceId: number
}
```

#### Job
```typescript
{
  id: number
  userId: number
  storageProfileId: number
  status: JobStatus
  type: JobType
  requestFileId: number
  errorMessage?: string
  currentState?: string
  startedAt?: string
  completedAt?: string
  lastHeartbeat?: string
  bytesDownloaded: number
  totalBytes: number
  selectedFileIndices: number[]
  progress: number
  fileName?: string
  storageProfileName?: string
}
```

#### Invoice
```typescript
{
  id: number
  userId: number
  jobId?: number
  originalAmountInUSD: number
  finalAmountInUSD: number
  finalAmountInNCurrency: number
  exchangeRate: number
  createdAt: string
  cancelledAt?: string
  paidAt?: string
  refundedAt?: string
  walletTransactionId?: number
  voucherId?: number
  torrentFileId: number
  expiresAt: string
  isExpired: boolean
  amount: number
  sizeInBytes: number
  fileName?: string
  status?: 'pending' | 'paid' | 'expired' | 'cancelled'
}
```

#### StorageProfile
```typescript
{
  id: number
  profileName: string
  providerType: StorageProviderType
  isDefault: boolean
  isActive: boolean
  createdAt: string
}
```

#### PaginatedResult<T>
```typescript
{
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
```

For complete type definitions, see `types/api.ts` in the frontend codebase.

---

## 🔧 Environment Variables

The frontend requires the following environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** The backend auth endpoint is currently hardcoded in `auth.config.ts` as `https://localhost:7185/api/auth/google-login`. This should be configurable via environment variable.

---

## 🔗 Key Integrations

### Axios Configuration
- **Base URL:** `NEXT_PUBLIC_API_URL` or `http://localhost:5000/api`
- **Request Interceptor:** Automatically adds `Authorization: Bearer <backend-token>` header
- **Response Interceptor:** Handles 401 errors by redirecting to login

### React Query (TanStack Query)
- Used for all server state management
- Automatic caching and refetching
- Optimistic updates where applicable
- DevTools enabled in development

### Google Drive OAuth Flow
1. Frontend calls `GET /api/storage/gdrive/connect?profileName={name}`
2. Backend returns `authorizationUrl`
3. Frontend opens popup window with authorization URL
4. User authorizes on Google
5. Backend redirects to `/storage?success=true&profileId=123` or `/storage?error=...&message=...`
6. Popup detects redirect and closes
7. Frontend resolves/rejects promise with profile ID or error

### Error Handling
- All API functions use Zod schemas for response validation
- Error messages are standardized via error message maps
- Toast notifications (Sonner) for user feedback
- 401 errors trigger automatic logout and redirect

### State Management
- **Server State:** TanStack Query (jobs, invoices, storage profiles, wallet)
- **Client State:** Zustand stores (for UI state, filters, etc.)
- **Form State:** React Hook Form with Zod validation

---

## 📝 Notes for Backend Development

1. **CORS Configuration:** Ensure backend allows requests from frontend origin
2. **Token Format:** Backend JWT should be returned in `accessToken` field
3. **Error Responses:** Use standard HTTP status codes (400, 401, 403, 404, 500)
4. **Pagination:** All list endpoints should support pagination with `pageNumber` and `pageSize`
5. **Date Formats:** Use ISO 8601 date strings (`YYYY-MM-DDTHH:mm:ss.sssZ`)
6. **File Uploads:** Use `multipart/form-data` for file uploads
7. **Type Safety:** Frontend uses Zod schemas - ensure backend responses match expected types
8. **Real-time Updates:** Consider WebSocket/SSE for job progress updates (currently polling via React Query)

---

## 🚦 Route Protection

- **Public Routes:** `/`, `/login`, `/callback`
- **Protected Routes:** All `/dashboard/*`, `/torrents/*`, `/wallet/*`, `/storage/*`, `/invoices/*`, `/admin/*`
- **Middleware:** `middleware.ts` handles route protection using NextAuth

---

## 📦 Build & Deployment

- **Development:** `npm run dev` (runs on port 3000)
- **Production Build:** `npm run build`
- **Production Start:** `npm start`
- **Type Checking:** TypeScript strict mode enabled
- **Linting:** ESLint with Next.js config

---

*Last Updated: December 2024*
*Frontend Version: 0.1.0*

