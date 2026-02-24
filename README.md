# TorrentClou Frontend

The Next.js 15 frontend for [TorrentClou](https://github.com/TorrenClou) — a self-hosted cloud torrent management platform.

> **Just want to run the whole project?** See [TorrenClou/deploy](https://github.com/TorrenClou/deploy) for one-command setup.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15 | React framework with App Router and SSR |
| React | 18 | UI library |
| TypeScript | 5.6 | Type safety (strict mode) |
| Tailwind CSS | 3.4 | Utility-first styling |
| NextAuth.js | 5 (beta) | Authentication (credentials + Google OAuth) |
| React Query | 5 (TanStack) | Server state, caching, background refetching |
| Zustand | 5 | Client-side state management |
| Zod | 4 | Runtime schema validation |
| Radix UI | - | Accessible headless UI primitives |
| Recharts | 3 | Dashboard charts and visualizations |
| Axios | 1.7 | HTTP client |
| React Hook Form | 7 | Form handling |
| Sonner | 1.7 | Toast notifications |

## Project Structure

```
app/
├── (auth)/              # Auth route group (login page)
├── (dashboard)/         # Dashboard route group
├── api/                 # API routes (NextAuth handlers)
├── dashboard/           # Main dashboard page
├── layout.tsx           # Root layout
└── page.tsx             # Landing page

components/
├── jobs/                # Job management components
├── layout/              # Sidebar, header, navigation
├── providers/           # React Query, auth, theme providers
├── shared/              # Reusable shared components
├── storage/             # Google Drive & S3 config components
└── ui/                  # Base UI primitives (Button, Dialog, etc.)

hooks/                   # Custom React hooks
lib/
├── api/                 # API client functions (health, etc.)
└── axios.ts             # Configured Axios instance
stores/                  # Zustand stores
types/                   # TypeScript types and Zod schemas
```

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (or npm)
- Running backend API (see [TorrenClou/backend](https://github.com/TorrenClou/backend))

## Development Setup

### 1. Clone and configure

```bash
git clone https://github.com/TorrenClou/frontend.git
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Start dev server

```bash
yarn dev
```

Opens at `http://localhost:3000`. The backend API should be running at `http://localhost:5000`.

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Build-time | `http://localhost:5000/api` | API base URL (used by browser) |
| `NEXT_PUBLIC_BACKEND_URL` | Build-time | `http://localhost:5000` | Backend root URL (Google Drive OAuth callbacks) |
| `BACKEND_URL` | Runtime | `http://localhost:5000` | Server-side API URL (SSR auth calls) |
| `NEXTAUTH_SECRET` | Runtime | - | NextAuth encryption secret |
| `NEXTAUTH_URL` | Runtime | `http://localhost:3000` | NextAuth canonical URL |

> **Note:** `NEXT_PUBLIC_*` variables are baked into the JavaScript bundle at build time and cannot be changed at runtime.

## Build

```bash
yarn build
```

The project uses `output: 'standalone'` in `next.config.js` for Docker-optimized builds. The standalone output is located at `.next/standalone/server.js`.

## Key Features

### Authentication
- Credential-based login via NextAuth.js v5
- Google OAuth integration
- JWT tokens stored in encrypted session cookies
- Server-side auth validation on protected routes via middleware

### Dashboard
- Real-time torrent download progress
- Job management (queue, retry, cancel)
- Storage usage statistics with charts

### Storage Management
- Google Drive: OAuth credential management, auto-sync configuration
- S3: Bucket configuration for AWS, Backblaze B2, MinIO, etc.

### UI/UX
- Responsive design (desktop + mobile)
- Dark/light theme toggle via `next-themes`
- Toast notifications for async operations
- Accessible components via Radix UI primitives

## CI/CD

Merging to `main` triggers a dispatch to the [deploy repo](https://github.com/TorrenClou/deploy), which builds the combined all-in-one Docker image containing both frontend and backend.

See `.github/workflows/dispatch-combined-build.yml`.

## Related Repositories

| Repository | Description |
|-----------|-------------|
| [TorrenClou/backend](https://github.com/TorrenClou/backend) | .NET 9.0 API and background workers |
| [TorrenClou/deploy](https://github.com/TorrenClou/deploy) | All-in-one Docker image, CI/CD, run scripts |

## License

See [LICENSE](LICENSE).
