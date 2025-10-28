'use client'

import { InboxContent } from './inbox-content'

interface MessagesPageContentProps {
  conversationId?: string
  onConversationClick: (conversationId: string) => void
}

export function MessagesPageContent({
  conversationId,
  onConversationClick,
}: MessagesPageContentProps) {
  return (
    <InboxContent conversationId={conversationId} onConversationClick={onConversationClick} />
  )
}
