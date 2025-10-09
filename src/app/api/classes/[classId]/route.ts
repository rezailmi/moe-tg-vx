import { NextResponse } from 'next/server'
import { getClassWithStudentsAndParents } from '@/lib/db/queries'

// Enable ISR caching - revalidate every 60 seconds
export const revalidate = 60

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params

    // Use optimized query that fetches class + students + parents in ONE query
    const classData = await getClassWithStudentsAndParents(classId)

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Transform enrollments to include students array for backward compatibility
    const response = {
      ...classData,
      students: classData.enrollments.map((e) => e.student),
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
