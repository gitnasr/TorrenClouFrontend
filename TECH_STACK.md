# TorrenClou Frontend - Tech Stack Overview

A comprehensive overview of the technologies and libraries used in the TorrenClou Frontend project.

---

## 🚀 Core Framework

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | ^15.0.0 | React framework for production with App Router, Server Components, and API routes |
| **React** | ^18.3.1 | JavaScript library for building user interfaces |
| **TypeScript** | ^5.6.2 | Typed superset of JavaScript for enhanced developer experience |

---

## 🎨 Styling & UI

| Technology | Version | Description |
|------------|---------|-------------|
| **Tailwind CSS** | ^3.4.11 | Utility-first CSS framework for rapid UI development |
| **tailwindcss-animate** | ^1.0.7 | Animation utilities plugin for Tailwind CSS |
| **tailwind-merge** | ^2.5.2 | Utility for merging Tailwind CSS classes without conflicts |
| **class-variance-authority** | ^0.7.0 | Creating variant-based component styles |
| **clsx** | ^2.1.1 | Utility for constructing className strings conditionally |

---

## 🧩 UI Components (Radix UI)

| Component | Version | Description |
|-----------|---------|-------------|
| **@radix-ui/react-avatar** | ^1.1.1 | Accessible avatar component |
| **@radix-ui/react-dialog** | ^1.1.1 | Modal dialog component |
| **@radix-ui/react-dropdown-menu** | ^2.1.1 | Dropdown menu component |
| **@radix-ui/react-label** | ^2.1.0 | Form label component |
| **@radix-ui/react-progress** | ^1.1.0 | Progress indicator component |
| **@radix-ui/react-select** | ^2.1.1 | Select input component |
| **@radix-ui/react-separator** | ^1.1.0 | Visual separator component |
| **@radix-ui/react-slot** | ^1.1.0 | Slot utility for component composition |
| **@radix-ui/react-switch** | ^1.1.0 | Toggle switch component |
| **@radix-ui/react-tabs** | ^1.1.0 | Tabbed interface component |
| **@radix-ui/react-toast** | ^1.2.1 | Toast notification component |
| **@radix-ui/react-tooltip** | ^1.2.8 | Tooltip component |

---

## 📊 State Management & Data Fetching

| Technology | Version | Description |
|------------|---------|-------------|
| **@tanstack/react-query** | ^5.56.2 | Powerful data synchronization and caching library |
| **@tanstack/react-query-devtools** | ^5.91.1 | DevTools for React Query debugging |
| **Zustand** | ^5.0.9 | Lightweight state management library |
| **Axios** | ^1.7.7 | Promise-based HTTP client for API requests |

---

## 🔐 Authentication

| Technology | Version | Description |
|------------|---------|-------------|
| **next-auth** | ^5.0.0-beta.25 | Authentication solution for Next.js (Auth.js v5) |

---

## 📝 Forms & Validation

| Technology | Version | Description |
|------------|---------|-------------|
| **react-hook-form** | ^7.68.0 | Performant form library with easy validation |
| **@hookform/resolvers** | ^5.2.2 | Validation resolvers for react-hook-form |
| **Zod** | ^4.1.13 | TypeScript-first schema validation library |

---

## 🛠️ Utilities

| Technology | Version | Description |
|------------|---------|-------------|
| **date-fns** | ^4.1.0 | Modern JavaScript date utility library |
| **lucide-react** | ^0.445.0 | Beautiful & consistent icon library |
| **next-themes** | ^0.4.4 | Theme management for Next.js (dark/light mode) |
| **sonner** | ^1.7.0 | Toast notifications library |
| **recharts** | ^3.5.1 | Charting library built on React components |

---

## 🔧 Development Tools

| Technology | Version | Description |
|------------|---------|-------------|
| **ESLint** | ^8.57.1 | JavaScript/TypeScript linter |
| **eslint-config-next** | ^15.0.0 | ESLint configuration for Next.js |
| **PostCSS** | ^8.4.47 | CSS transformation tool |
| **Autoprefixer** | ^10.4.20 | PostCSS plugin for vendor prefixes |

---

## 📁 Project Structure

```
Frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes (protected)
│   ├── admin/              # Admin panel routes
│   └── api/                # API routes
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & API clients
│   ├── api/                # API service functions
│   └── utils/              # Helper utilities
├── schemas/                # Zod validation schemas
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

---

## 🎯 Key Features

- **App Router** - Utilizes Next.js 15 App Router for modern routing
- **Server Components** - Leverages React Server Components for performance
- **Type Safety** - Full TypeScript support throughout the codebase
- **Dark Mode** - Built-in theme support with `next-themes`
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **OAuth Integration** - Google Drive OAuth flow for storage profiles
- **Real-time Data** - React Query for efficient data fetching and caching

---

*Last updated: December 2024*
