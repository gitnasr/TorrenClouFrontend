// Health API — public endpoints, no auth required
// Base URL reuses NEXT_PUBLIC_API_URL so it's always consistent with the rest of the app.
// e.g. NEXT_PUBLIC_API_URL = 'http://localhost:5000/api'
// → /health/ready resolves to 'http://localhost:5000/api/health/ready'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export type HealthStatus = 'operational' | 'degraded' | 'down' | 'loading'
export type ServiceStatus = 'healthy' | 'unhealthy' | 'timeout'

export interface ReadinessResponse {
    timestamp: string
    isHealthy: boolean
    database: ServiceStatus
    redis: ServiceStatus
    version: string
    databaseResponseTimeMs: number | null
    redisResponseTimeMs: number | null
}

export interface ReadinessResult {
    status: HealthStatus
    data: ReadinessResponse | null
}

/**
 * Fetch /api/health/ready
 * The request is sent with cache: 'no-store' so every call hits the server.
 * Client-side caching and polling frequency (staleTime) is managed by useHealth.
 */
export async function getReadiness(): Promise<ReadinessResult> {
    try {
        const res = await fetch(`${API_BASE}/health/ready`, {
            cache: 'no-store',
        })
        const data: ReadinessResponse = await res.json()

        const status: HealthStatus = res.ok
            ? 'operational'
            : data.database === 'timeout' || data.redis === 'timeout'
                ? 'degraded'
                : 'down'

        return { status, data }
    } catch {
        return { status: 'down', data: null }
    }
}
