'use client'

import { InboxLayout } from '@/components/inbox/inbox-layout'

interface InboxContentProps {
  conversationId?: string
  onConversationClick: (conversationId: string) => void
}

export function InboxContent({ conversationId, onConversationClick }: InboxContentProps) {
  return <InboxLayout conversationId={conversationId} onConversationClick={onConversationClick} />
}
