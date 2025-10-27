import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/conversations - List all conversations for current teacher
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')

    // Build query to fetch conversations with enriched data
    let query = supabase
      .from('conversations')
      .select(`
        *,
        student:students!student_id (
          id,
          name,
          student_id
        ),
        class:classes!class_id (
          id,
          name
        ),
        messages:conversation_messages (
          id,
          content,
          sender_name,
          sender_type,
          created_at,
          read
        )
      `)
      .order('last_message_at', { ascending: false })

    // Filter by teacher if provided
    if (teacherId) {
      query = query.eq('teacher_id', teacherId)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch conversations',
          details: error.message,
        },
        { status: 500 }
      )
    }

    // Calculate unread count for each conversation
    const enrichedConversations = conversations?.map((conv) => ({
      ...conv,
      unread_count: conv.messages?.filter((m) => !m.read && m.sender_type === 'parent').length || 0,
      latest_message: conv.messages?.[0] || null,
    })) || []

    return NextResponse.json({
      success: true,
      conversations: enrichedConversations,
      total: enrichedConversations.length,
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/conversations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
      },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { student_id, class_id, teacher_id, subject } = body

    // Validate required fields
    if (!student_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student ID is required',
        },
        { status: 400 }
      )
    }

    if (!class_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required',
        },
        { status: 400 }
      )
    }

    if (!teacher_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Teacher ID is required',
        },
        { status: 400 }
      )
    }

    // Create conversation in database
    const { data: conversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        student_id,
        class_id,
        teacher_id,
        subject: subject || null,
        status: 'active',
      })
      .select(`
        *,
        student:students!student_id (
          id,
          name,
          student_id
        ),
        class:classes!class_id (
          id,
          name
        )
      `)
      .single()

    if (insertError) {
      console.error('Error creating conversation:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create conversation',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/conversations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create conversation',
      },
      { status: 500 }
    )
  }
}
