'use client'

import { useQuery } from '@tanstack/react-query'
import { transformToConversationGroups } from '@/lib/utils/conversation-transform'
import type { EnrichedConversation, ConversationGroup } from '@/types/inbox'

interface UseConversationsQueryOptions {
  teacherId?: string
  enabled?: boolean
}

interface ConversationsResponse {
  success: boolean
  conversations: EnrichedConversation[]
  total: number
}

/**
 * Fetches conversations from the API
 */
async function fetchConversations(teacherId?: string): Promise<EnrichedConversation[]> {
  // Build query params
  const params = new URLSearchParams()
  if (teacherId) {
    params.append('teacherId', teacherId)
  }

  const url = `/api/conversations${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch conversations' }))
    throw new Error(errorData.error || 'Failed to fetch conversations')
  }

  const data: ConversationsResponse = await response.json()
  return data.conversations || []
}

/**
 * React Query hook to fetch and cache inbox conversations
 *
 * @param options - Options for fetching conversations
 * @param options.teacherId - Optional teacher ID to filter conversations
 * @param options.enabled - Whether the query should run (default: true)
 *
 * @returns Object containing conversation groups, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: conversationGroups, isLoading, error } = useConversationsQuery({
 *   teacherId: '123'
 * })
 * ```
 */
export function useConversationsQuery(options: UseConversationsQueryOptions = {}) {
  const { teacherId, enabled = true } = options

  return useQuery({
    // Query key includes teacherId to cache separately per teacher
    queryKey: ['conversations', teacherId],

    // Fetcher function
    queryFn: () => fetchConversations(teacherId),

    // Transform raw conversation data into UI-ready conversation groups
    select: (data: EnrichedConversation[]): ConversationGroup[] => {
      return transformToConversationGroups(data)
    },

    // Only run query if enabled and teacherId is provided
    enabled: enabled && !!teacherId,

    // Refetch on mount only if data is stale (> 30s old, from QueryClient config)
    refetchOnMount: true,

    // Don't refetch on window focus for better UX
    refetchOnWindowFocus: false,

    // Keep previous data while fetching new data to prevent UI flicker
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Hook to get raw conversation data without transformation
 * Useful for operations that need the original database format
 */
export function useConversationsRawQuery(options: UseConversationsQueryOptions = {}) {
  const { teacherId, enabled = true } = options

  return useQuery({
    queryKey: ['conversations', teacherId],
    queryFn: () => fetchConversations(teacherId),
    enabled: enabled && !!teacherId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}
