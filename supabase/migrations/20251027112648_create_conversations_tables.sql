-- Create conversations tables for parent-teacher messaging
-- Migration: 20251027112648_create_conversations_tables.sql

-- =====================================================
-- Table 1: conversations
-- Stores conversation threads between teachers and parents
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'resolved')),
  subject TEXT,  -- Optional topic/subject of conversation
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_conversations_student ON conversations(student_id);
CREATE INDEX idx_conversations_teacher ON conversations(teacher_id);
CREATE INDEX idx_conversations_class ON conversations(class_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_status ON conversations(status);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Table 2: conversation_messages
-- Stores individual messages within conversations
-- =====================================================
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('teacher', 'parent')),
  sender_name TEXT NOT NULL,  -- e.g., "Mrs. Tan", "Mr. Wong", "Teacher Sarah"
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient message retrieval
CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON conversation_messages(conversation_id, read) WHERE read = FALSE;

-- =====================================================
-- Table 3: conversation_participants
-- Stores participants in each conversation
-- =====================================================
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  participant_type TEXT NOT NULL CHECK (participant_type IN ('teacher', 'parent')),
  participant_name TEXT NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure unique participants per conversation
CREATE UNIQUE INDEX idx_participants_unique ON conversation_participants(conversation_id, participant_type, participant_name);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Conversations: Teachers can view their students' conversations
CREATE POLICY "Teachers can view their students' conversations"
  ON conversations FOR SELECT
  USING (teacher_id = auth.uid()::uuid);

CREATE POLICY "Teachers can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (teacher_id = auth.uid()::uuid);

CREATE POLICY "Teachers can update their conversations"
  ON conversations FOR UPDATE
  USING (teacher_id = auth.uid()::uuid)
  WITH CHECK (teacher_id = auth.uid()::uuid);

-- Messages: Teachers can view messages in their conversations
CREATE POLICY "Teachers can view messages in their conversations"
  ON conversation_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.teacher_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Teachers can send messages in their conversations"
  ON conversation_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.teacher_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Teachers can update messages in their conversations"
  ON conversation_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.teacher_id = auth.uid()::uuid
    )
  );

-- Participants: Teachers can view participants in their conversations
CREATE POLICY "Teachers can view participants in their conversations"
  ON conversation_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_participants.conversation_id
      AND conversations.teacher_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Teachers can add participants to their conversations"
  ON conversation_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_participants.conversation_id
      AND conversations.teacher_id = auth.uid()::uuid
    )
  );

-- =====================================================
-- Development Policies (Allow all operations in dev)
-- =====================================================

-- Allow all operations on conversations in development
CREATE POLICY "Allow all operations on conversations in dev"
  ON conversations
  USING (true)
  WITH CHECK (true);

-- Allow all operations on messages in development
CREATE POLICY "Allow all operations on messages in dev"
  ON conversation_messages
  USING (true)
  WITH CHECK (true);

-- Allow all operations on participants in development
CREATE POLICY "Allow all operations on participants in dev"
  ON conversation_participants
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE conversations IS 'Stores conversation threads between teachers and parents about students';
COMMENT ON TABLE conversation_messages IS 'Individual messages within conversations';
COMMENT ON TABLE conversation_participants IS 'Participants in each conversation (teachers and parents)';

COMMENT ON COLUMN conversations.status IS 'Conversation status: active (ongoing), archived (no longer active), resolved (issue addressed)';
COMMENT ON COLUMN conversations.subject IS 'Optional topic/subject of the conversation (e.g., Math Performance, Behavior Concern)';
COMMENT ON COLUMN conversation_messages.sender_type IS 'Type of sender: teacher or parent';
COMMENT ON COLUMN conversation_messages.sender_name IS 'Display name of the sender (e.g., Mrs. Tan, Teacher Sarah)';
COMMENT ON COLUMN conversation_participants.last_read_at IS 'Timestamp when participant last read messages in this conversation';
