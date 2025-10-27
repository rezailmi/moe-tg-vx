'use client'

import { createContext, useContext, ReactNode, useRef } from 'react'
import { useConversationsQuery } from '@/hooks/queries/use-conversations-query'
import { useUser } from '@/contexts/user-context'
import type { ConversationGroup, Priority } from '@/types/inbox'

interface InboxContextValue {
  conversationGroups: ConversationGroup[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const InboxContext = createContext<InboxContextValue | undefined>(undefined)

interface InboxProviderProps {
  children: ReactNode
}

/**
 * InboxProvider - Provides stable conversation data across inbox navigation
 *
 * This provider lifts the conversations query above the navigation boundary,
 * ensuring the conversation list remains stable when switching between conversations.
 *
 * Key benefits:
 * - No flicker when switching conversations
 * - Single query instance shared across inbox views
 * - Conversation list data persists during navigation
 *
 * @example
 * ```tsx
 * <InboxProvider>
 *   <InboxLayout conversationId={id} />
 * </InboxProvider>
 * ```
 */
export function InboxProvider({ children }: InboxProviderProps) {
  const { user } = useUser()

  // Single persistent query instance for all inbox views
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useConversationsQuery({
    teacherId: user?.user_id,
  })

  // Use ref to hold the last valid conversation data
  // This avoids state updates and prevents infinite loops
  const lastValidDataRef = useRef<ConversationGroup[]>([])

  // Update ref when we have valid data
  if (queryData && queryData.length > 0) {
    lastValidDataRef.current = queryData
  }

  // Use query data only if it has items, otherwise use last valid data from ref
  // This prevents showing empty state during navigation transitions
  const conversationGroups = (queryData && queryData.length > 0) ? queryData : lastValidDataRef.current

  return (
    <InboxContext.Provider
      value={{
        conversationGroups,
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </InboxContext.Provider>
  )
}

/**
 * Hook to access inbox conversation data
 *
 * Must be used within InboxProvider
 *
 * @throws Error if used outside InboxProvider
 * @returns Stable conversation groups and loading state
 */
export function useInbox() {
  const context = useContext(InboxContext)

  if (context === undefined) {
    throw new Error('useInbox must be used within InboxProvider')
  }

  return context
}
