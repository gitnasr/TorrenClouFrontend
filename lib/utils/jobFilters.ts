// Job filtering utilities for role-based visibility
import type { Job } from '@/types/jobs'
import { JobStatus, JobType, UserRole } from '@/types/enums'
import { statusLabels } from '@/types/jobs'

/**
 * Check if a job status should be visible to a user based on their role
 * @param status - The job status to check
 * @param userRole - The user's role (optional)
 * @returns true if the status should be visible to the user
 */
export function isStatusVisibleToUser(
    status: JobStatus,
    userRole?: UserRole
): boolean {
    // Admin and Support can see all statuses
    if (userRole === UserRole.Admin || userRole === UserRole.Support) {
        return true
    }

    // All job statuses are now visible to regular users
    // Sync jobs are handled separately by their own system
    return true
}

/**
 * Check if a job type should be visible to a user based on their role
 * @param jobType - The job type to check
 * @param userRole - The user's role (optional)
 * @returns true if the job type should be visible to the user
 */
export function isJobTypeVisibleToUser(
    jobType: JobType,
    userRole?: UserRole
): boolean {
    // Admin and Support can see all job types
    if (userRole === UserRole.Admin || userRole === UserRole.Support) {
        return true
    }

    // Regular users cannot see Sync type jobs
    if (jobType === JobType.Sync) {
        return false
    }

    return true
}

/**
 * Filter jobs based on user role
 * - Admin and Support: See all jobs
 * - Regular users: Filter out Sync type jobs and jobs with SYNCING/SYNC_RETRY status
 * @param jobs - Array of jobs to filter
 * @param userRole - The user's role (optional)
 * @returns Filtered array of jobs
 */
export function filterJobsForUser(
    jobs: Job[],
    userRole?: UserRole
): Job[] {
    // Admin and Support can see all jobs
    if (userRole === UserRole.Admin || userRole === UserRole.Support) {
        return jobs
    }

    // Regular users: filter out Sync jobs and internal sync stages
    return jobs.filter((job) => {
        // Filter out Sync type jobs
        if (!isJobTypeVisibleToUser(job.type as JobType, userRole)) {
            return false
        }

        // Filter out jobs with internal sync statuses
        if (!isStatusVisibleToUser(job.status as JobStatus, userRole)) {
            return false
        }

        return true
    })
}

/**
 * Get user-friendly label for a job status
 * @param status - The job status enum value
 * @returns User-friendly label string
 */
export function getStatusLabel(status: JobStatus): string {
    return statusLabels[status] || status
}







