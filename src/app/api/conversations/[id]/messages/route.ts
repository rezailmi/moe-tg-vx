import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id } = await context.params

    // Fetch messages for this conversation
    const { data: messages, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch messages',
          details: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
      total: messages?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/conversations/[id]/messages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      },
      { status: 500 }
    )
  }
}

// POST /api/conversations/[id]/messages - Send a new message
export async function POST(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id } = await context.params
    const body = await request.json()
    const { sender_type, sender_name, content } = body

    // Validate required fields
    if (!content || content.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Message content is required',
        },
        { status: 400 }
      )
    }

    if (!sender_type || !['teacher', 'parent'].includes(sender_type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid sender_type is required (teacher or parent)',
        },
        { status: 400 }
      )
    }

    if (!sender_name || sender_name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Sender name is required',
        },
        { status: 400 }
      )
    }

    // Insert message into database
    const { data: message, error: insertError } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: id,
        sender_type,
        sender_name,
        content,
        read: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating message:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    // Update conversation last_message_at timestamp
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating conversation timestamp:', updateError)
      // Don't fail the request if timestamp update fails
    }

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/conversations/[id]/messages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
      },
      { status: 500 }
    )
  }
}
