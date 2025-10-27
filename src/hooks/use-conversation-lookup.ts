'use client'

import { useMemo } from 'react'
import type { ConversationGroup, ConversationThread } from '@/types/inbox'

/**
 * Creates an O(1) lookup map for conversations by ID
 *
 * This hook transforms an array of conversation groups into a Map
 * for instant conversation retrieval by ID, avoiding the need for
 * linear O(n*m) searches through groups and threads.
 *
 * @param conversationGroups - Array of conversation groups from inbox
 * @returns Object with lookup function and conversation map
 *
 * @example
 * ```tsx
 * const { getConversation, conversationMap } = useConversationLookup(conversationGroups)
 *
 * // O(1) lookup instead of O(n*m) search
 * const conversation = getConversation('conv-123')
 * ```
 */
export function useConversationLookup(conversationGroups: ConversationGroup[]) {
  // Build lookup map only when conversationGroups reference changes
  const conversationMap = useMemo(() => {
    const map = new Map<string, ConversationThread>()

    // Flatten all threads from all groups into a single map
    for (const group of conversationGroups) {
      for (const thread of group.threads) {
        map.set(thread.id, thread)
      }
    }

    return map
  }, [conversationGroups])

  // Lookup function for convenient access
  const getConversation = useMemo(
    () => (conversationId: string): ConversationThread | undefined => {
      return conversationMap.get(conversationId)
    },
    [conversationMap]
  )

  // Get messages for a specific conversation
  const getMessages = useMemo(
    () => (conversationId: string) => {
      const conversation = conversationMap.get(conversationId)
      return conversation?.messages || []
    },
    [conversationMap]
  )

  // Get participants for a specific conversation
  const getParticipants = useMemo(
    () => (conversationId: string) => {
      const conversation = conversationMap.get(conversationId)
      return conversation?.participants || []
    },
    [conversationMap]
  )

  // Check if a conversation exists
  const hasConversation = useMemo(
    () => (conversationId: string): boolean => {
      return conversationMap.has(conversationId)
    },
    [conversationMap]
  )

  // Get all conversation IDs
  const conversationIds = useMemo(() => {
    return Array.from(conversationMap.keys())
  }, [conversationMap])

  return {
    conversationMap,
    getConversation,
    getMessages,
    getParticipants,
    hasConversation,
    conversationIds,
    totalConversations: conversationMap.size,
  }
}

/**
 * Hook to get a specific conversation directly
 *
 * Convenience hook that combines lookup with direct conversation selection.
 * Returns undefined if conversation doesn't exist or is loading.
 *
 * @param conversationGroups - Array of conversation groups
 * @param conversationId - ID of conversation to retrieve
 * @returns The conversation thread or undefined
 *
 * @example
 * ```tsx
 * const conversation = useConversation(conversationGroups, conversationId)
 *
 * if (!conversation) return <div>Loading...</div>
 * ```
 */
export function useConversation(
  conversationGroups: ConversationGroup[],
  conversationId?: string
): ConversationThread | undefined {
  const { getConversation } = useConversationLookup(conversationGroups)

  return useMemo(() => {
    if (!conversationId) return undefined
    return getConversation(conversationId)
  }, [conversationId, getConversation])
}
