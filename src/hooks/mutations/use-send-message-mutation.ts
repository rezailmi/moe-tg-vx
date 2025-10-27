'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { EnrichedConversation, ConversationGroup } from '@/types/inbox'
import type { Message } from '@/types/chat'

interface SendMessageParams {
  conversationId: string
  content: string
  senderType: 'teacher' | 'parent'
  senderName: string
}

interface SendMessageResponse {
  success: boolean
  message: {
    id: string
    conversation_id: string
    sender_type: 'teacher' | 'parent'
    sender_name: string
    content: string
    read: boolean
    created_at: string
  }
}

/**
 * Sends a message to the API
 */
async function sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
  const { conversationId, content, senderType, senderName } = params

  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender_type: senderType,
      sender_name: senderName,
      content,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }))
    throw new Error(errorData.error || 'Failed to send message')
  }

  return response.json()
}

/**
 * React Query mutation hook to send messages with optimistic updates
 *
 * Features:
 * - Optimistic UI updates (message appears immediately)
 * - Automatic rollback on error
 * - Cache invalidation to keep conversation list updated
 * - Visual feedback with 'sending' status
 *
 * @param teacherId - The teacher ID for cache key
 *
 * @example
 * ```tsx
 * const sendMessageMutation = useSendMessageMutation(teacherId)
 *
 * sendMessageMutation.mutate({
 *   conversationId: 'conv-123',
 *   content: 'Hello!',
 *   senderType: 'teacher',
 *   senderName: 'Mr. Tan'
 * })
 * ```
 */
export function useSendMessageMutation(teacherId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,

    // Optimistic update - runs immediately before API call
    onMutate: async (params: SendMessageParams) => {
      const { conversationId, content, senderType, senderName } = params

      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['conversations', teacherId] })

      // Snapshot the previous value for rollback
      const previousData = queryClient.getQueryData<EnrichedConversation[]>([
        'conversations',
        teacherId,
      ])

      // Create optimistic message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_type: senderType,
        sender_name: senderName,
        content,
        read: false,
        created_at: new Date().toISOString(),
      }

      // Optimistically update the cache
      queryClient.setQueryData<EnrichedConversation[]>(
        ['conversations', teacherId],
        (oldData) => {
          if (!oldData) return oldData

          return oldData.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...(conv.messages || []), optimisticMessage],
                last_message_at: optimisticMessage.created_at,
              }
            }
            return conv
          })
        }
      )

      // Return context for rollback
      return { previousData, optimisticMessageId: optimisticMessage.id }
    },

    // On success - update optimistic message with real data
    onSuccess: (data, params, context) => {
      const { conversationId } = params

      queryClient.setQueryData<EnrichedConversation[]>(
        ['conversations', teacherId],
        (oldData) => {
          if (!oldData) return oldData

          return oldData.map((conv) => {
            if (conv.id === conversationId) {
              // Replace optimistic message with real message from server
              const updatedMessages = (conv.messages || []).map((msg) =>
                msg.id === context?.optimisticMessageId ? data.message : msg
              )

              return {
                ...conv,
                messages: updatedMessages,
                last_message_at: data.message.created_at,
              }
            }
            return conv
          })
        }
      )

      // Optionally invalidate to ensure fresh data (background refetch)
      queryClient.invalidateQueries({ queryKey: ['conversations', teacherId] })
    },

    // On error - rollback to previous state
    onError: (error, params, context) => {
      console.error('Failed to send message:', error)

      // Rollback to previous data
      if (context?.previousData) {
        queryClient.setQueryData(['conversations', teacherId], context.previousData)
      }

      // Optionally: Could update the optimistic message to show 'failed' status instead of removing it
      // This would allow users to retry failed messages
    },

    // Always refetch after mutation settles (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', teacherId] })
    },
  })
}

/**
 * Helper hook to check if any message is currently being sent
 */
export function useIsSendingMessage(conversationId?: string) {
  const queryClient = useQueryClient()

  // Check if there are any pending mutations for this conversation
  const isMutating = queryClient.isMutating({
    mutationKey: ['sendMessage', conversationId],
  })

  return isMutating > 0
}
