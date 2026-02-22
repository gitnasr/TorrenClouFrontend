# TorrenClou Frontend

A modern, high-performance SaaS frontend for a Torrent-to-Cloud service built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 15** with App Router
- 🔐 **NextAuth.js v5** with Google OAuth integration
- 📊 **Real-time Updates** with TanStack Query
- 🎨 **Dark Mode** first design with Shadcn/UI
- 📱 **Fully Responsive** mobile-first design
- 🔔 **Toast Notifications** with Sonner

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** TanStack Query v5
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Icons:** Lucide React
- **HTTP Client:** Axios with interceptors
- **Notifications:** Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── jobs/                # Jobs page
│   │   ├── storage/             # Storage profiles page
│   │   └── settings/            # Settings page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── dashboard-layout.tsx
│   ├── providers/               # Context providers
│   └── ui/                      # Shadcn/UI components
├── lib/
│   ├── axios.ts                 # Axios instance with interceptors
│   ├── react-query.tsx          # TanStack Query provider
│   └── utils.ts                 # Utility functions
├── auth.config.ts               # NextAuth configuration
├── auth.ts                      # NextAuth exports
└── middleware.ts                # Route protection middleware
```

## Authentication Flow

1. User clicks "Login with Google" on the landing page
2. NextAuth handles the Google OAuth flow
3. In the `signIn` callback, the Google `id_token` is sent to the backend API: `POST /api/auth/google-login`
4. Backend returns a custom JWT (Access Token) + User Data (Balance, Region)
5. The backend JWT is stored in the NextAuth session and accessible throughout the app
6. Axios interceptors automatically attach the backend JWT to all API requests

## API Integration

The frontend expects the following backend endpoints:

- `POST /api/auth/google-login` - Google OAuth login
- `POST /api/torrents/analyze` - Analyze torrent for job creation
- `POST /api/torrents/create-job` - Create a download job
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/:id/retry` - Retry a failed job
- `POST /api/jobs/:id/cancel` - Cancel a job
- `GET /api/storage/profiles` - Get storage profiles
- `POST /api/storage/gdrive/configure` - Configure Google Drive with OAuth credentials

## Features Overview

### Landing Page
- Hero section with call-to-action
- Features grid highlighting key benefits
- Google OAuth login integration

### Dashboard
- **Home:** Torrent upload and file selection for cloud transfer
- **Jobs:** Data table showing active jobs with progress tracking
- **Storage:** Manage cloud storage profiles (Google Drive, S3)
- **Settings:** Account settings (placeholder)

### Layout
- Sidebar navigation
- Topbar with live wallet balance and user menu
- Dark/Light mode toggle
- Responsive design

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

