'use client'

import useSWR from 'swr'
import { getPTMStudents } from '@/app/actions/ptm-actions'
import type { PTMStudentData, PTMConfig } from '@/types/ptm'
import { useMemo } from 'react'

/**
 * Hook to fetch PTM student data with SWR caching
 *
 * This hook handles:
 * - Mock mode configuration via environment variables
 * - SWR caching and revalidation
 * - Loading, error, and empty states
 * - Manual refresh capability
 *
 * @param teacherId - Optional teacher ID (if not provided, uses mock mode or auth)
 * @param config - Optional PTM configuration
 * @returns PTM student data with loading and error states
 */
export function usePTMStudents(teacherId?: string, config?: PTMConfig) {
  // Determine if we're in mock mode and get mock teacher ID
  const effectiveConfig = useMemo<PTMConfig>(() => {
    const useMockMode =
      process.env.NEXT_PUBLIC_PTM_MOCK_MODE === 'true' && !teacherId
    const mockTeacherId = process.env.NEXT_PUBLIC_PTM_MOCK_TEACHER_ID

    return {
      useMockMode,
      teacherId: useMockMode ? mockTeacherId : teacherId,
      lowAttendanceThreshold: 85,
      includeInactiveCases: false,
      ...config,
    }
  }, [teacherId, config])

  // Create SWR key based on config
  const swrKey = useMemo(() => {
    const tid = effectiveConfig.teacherId || 'unknown'
    return `ptm-students-${tid}`
  }, [effectiveConfig.teacherId])

  // Fetcher function that calls the server action
  const fetcher = async (): Promise<PTMStudentData> => {
    if (!effectiveConfig.teacherId) {
      throw new Error('No teacher ID available for PTM students')
    }

    return await getPTMStudents(effectiveConfig.teacherId, effectiveConfig)
  }

  // Use SWR for caching and revalidation
  const { data, error, isLoading, isValidating, mutate } = useSWR<PTMStudentData>(
    effectiveConfig.teacherId ? swrKey : null,
    fetcher,
    {
      // Revalidate every 5 minutes (PTM data doesn't change frequently)
      refreshInterval: 300000,

      // Revalidate on mount to ensure fresh data
      revalidateOnMount: true,

      // Don't revalidate on window focus (PTM is not real-time critical)
      revalidateOnFocus: false,

      // Keep previous data while revalidating
      keepPreviousData: true,

      // Dedupe requests within 10 seconds
      dedupingInterval: 10000,
    }
  )

  // Determine loading state
  const loading = (isLoading || isValidating) && !data

  return {
    /**
     * PTM student data (undefined if loading or not yet fetched)
     */
    data,

    /**
     * Array of PTM students (sorted by priority)
     */
    students: data?.students ?? [],

    /**
     * Total count of students
     */
    totalCount: data?.totalCount ?? 0,

    /**
     * Count of high priority students
     */
    highPriorityCount: data?.highPriorityCount ?? 0,

    /**
     * Count of medium priority students
     */
    mediumPriorityCount: data?.mediumPriorityCount ?? 0,

    /**
     * Count of low priority students
     */
    lowPriorityCount: data?.lowPriorityCount ?? 0,

    /**
     * Form class ID for routing
     */
    formClassId: data?.formClassId,

    /**
     * Form class name
     */
    formClassName: data?.formClassName,

    /**
     * Loading state
     */
    loading,

    /**
     * Is currently revalidating in the background
     */
    isValidating,

    /**
     * Error if fetch failed
     */
    error: error as Error | null,

    /**
     * Function to manually refresh the data
     */
    refresh: mutate,

    /**
     * Whether data is empty (no students)
     */
    isEmpty: data?.totalCount === 0,

    /**
     * Whether we're in mock mode
     */
    isMockMode: effectiveConfig.useMockMode,
  }
}
