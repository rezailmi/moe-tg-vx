'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/types/database'

export interface StudentProfileData {
  // Basic info
  id: string
  student_id: string
  name: string
  class_name: string
  year_level: string
  form_class_id: string | null

  // Overview data
  overview: {
    background: string | null
    medical_conditions: Json | null
    health_declaration: Json | null
    mental_wellness: Json | null
    family: Json | null
    housing_finance: Json | null
    is_swan: boolean
    swan_details: Json | null
  } | null

  // Guardian info
  guardian: {
    name: string
    email: string
    phone: string
    relationship: string
  } | null

  // Academic results
  academic_results: Array<{
    id: string
    assessment_type: string
    assessment_name: string
    assessment_date: string
    term: string | null
    score: number | null
    max_score: number | null
    percentage: number | null
    grade: string | null
    remarks: string | null
  }>

  // Attendance
  attendance: {
    total_days: number
    present: number
    absent: number
    late: number
    early_dismissal: number
    attendance_rate: number
    recent_records: Array<{
      date: string
      status: string
      type: string
      reason: string | null
    }>
  }

  // Physical fitness
  physical_fitness: Array<{
    id: string
    assessment_date: string
    assessment_type: string
    metrics: Json
    overall_grade: string | null
    pass_status: boolean | null
  }>

  // CCE results
  cce_results: Array<{
    id: string
    term: string
    academic_year: string
    character: string | null
    citizenship: string | null
    education: string | null
    overall_grade: string | null
    comments: string | null
  }>

  // Behaviour observations
  behaviour_observations: Array<{
    id: string
    observation_date: string
    category: string
    title: string
    description: string
    severity: string | null
    action_taken: string | null
  }>

  // Friend relationships
  friend_relationships: Array<{
    friend_name: string
    relationship_type: string | null
    closeness_level: string | null
    notes: string | null
  }>

  // Private notes
  private_notes: Array<{
    id: string
    note: string
    created_by: string
    created_at: string
    updated_at: string
  }>

  // Cases
  cases: Array<{
    id: string
    case_number: string
    case_type: string
    title: string
    description: string | null
    status: string
    severity: string | null
    opened_date: string
    closed_date: string | null
    guardian_notified: boolean
  }>
}

export function useStudentProfile(studentName: string) {
  const [student, setStudent] = useState<StudentProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStudentProfile() {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        // 1. Get basic student info with guardian
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select(`
            id,
            student_id,
            name,
            year_level,
            parents_guardians:primary_guardian_id(
              name,
              email,
              phone,
              relationship
            )
          `)
          .eq('name', studentName)
          .single()

        if (studentError) throw studentError
        if (!studentData || typeof studentData !== 'object' || !('id' in studentData)) {
          throw new Error('Student not found')
        }

        const typedStudentData = studentData as { id: string; name: string; student_id: string; year_level: string; parents_guardians?: { name: string; email: string; phone: string; relationship: string } | null }

        // 1b. Get form class through student_classes junction table
        const { data: formClassData } = await supabase
          .from('student_classes')
          .select(`
            classes(
              id,
              name
            )
          `)
          .eq('student_id', typedStudentData.id)
          .limit(1)
          .single()

        const formClass = formClassData ? (formClassData as { classes: { id: string; name: string } }).classes : null

        // 2. Get student overview
        const { data: overviewData } = await supabase
          .from('student_overview')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .single()

        // 3. Get academic results
        const { data: academicData } = await supabase
          .from('academic_results')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('assessment_date', { ascending: false })

        // 4. Get attendance stats
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('date', { ascending: false })

        // Calculate attendance stats
        const totalDays = attendanceData?.length || 0
        const present = attendanceData?.filter(a => typeof a === 'object' && a !== null && 'status' in a && (a as { status: string }).status === 'present').length || 0
        const absent = attendanceData?.filter(a => typeof a === 'object' && a !== null && 'status' in a && (a as { status: string }).status === 'absent').length || 0
        const late = attendanceData?.filter(a => typeof a === 'object' && a !== null && 'status' in a && (a as { status: string }).status === 'late').length || 0
        const early_dismissal = attendanceData?.filter(a => typeof a === 'object' && a !== null && 'status' in a && (a as { status: string }).status === 'early_dismissal').length || 0
        const attendance_rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0

        // 5. Get physical fitness
        const { data: fitnessData } = await supabase
          .from('physical_fitness')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('assessment_date', { ascending: false })

        // 6. Get CCE results
        const { data: cceData } = await supabase
          .from('cce_results')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('academic_year', { ascending: false })
          .order('term', { ascending: false })

        // 7. Get behaviour observations
        const { data: behaviourData } = await supabase
          .from('behaviour_observations')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('observation_date', { ascending: false })

        // 8. Get friend relationships
        const { data: friendsData } = await supabase
          .from('friend_relationships')
          .select(`
            friend:students!friend_id(
              name
            ),
            relationship_type,
            closeness_level,
            notes
          `)
          .eq('student_id', typedStudentData.id)

        // 9. Get private notes
        const { data: privateNotesData } = await supabase
          .from('student_private_notes')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('updated_at', { ascending: false })

        // 10. Get cases
        const { data: casesData } = await supabase
          .from('cases')
          .select('*')
          .eq('student_id', typedStudentData.id)
          .order('opened_date', { ascending: false })

        // Assemble the profile data
        const profileData: StudentProfileData = {
          id: typedStudentData.id,
          student_id: typedStudentData.student_id,
          name: typedStudentData.name,
          class_name: formClass?.name || 'N/A',
          year_level: typedStudentData.year_level,
          form_class_id: formClass?.id || null,
          overview: overviewData || null,
          guardian: typedStudentData.parents_guardians || null,
          academic_results: academicData || [],
          attendance: {
            total_days: totalDays,
            present,
            absent,
            late,
            early_dismissal,
            attendance_rate,
            recent_records: (attendanceData || []).slice(0, 10)
              .filter(a => typeof a === 'object' && a !== null)
              .map(a => {
                const record = a as { date?: string; status?: string; type?: string; reason?: string | null }
                return {
                  date: record.date || '',
                  status: record.status || '',
                  type: record.type || '',
                  reason: record.reason || '',
                }
              }),
          },
          physical_fitness: fitnessData || [],
          cce_results: cceData || [],
          behaviour_observations: behaviourData || [],
          friend_relationships: (friendsData || []).map((f: { friend?: { name: string }; relationship_type: string | null; closeness_level: string | null; notes: string | null }) => ({
            friend_name: f.friend?.name || 'Unknown',
            relationship_type: f.relationship_type,
            closeness_level: f.closeness_level,
            notes: f.notes,
          })),
          private_notes: privateNotesData || [],
          cases: casesData || [],
        }

        setStudent(profileData)
      } catch (err) {
        console.error('Error fetching student profile:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch student profile'))
      } finally {
        setLoading(false)
      }
    }

    if (studentName) {
      fetchStudentProfile()
    }
  }, [studentName])

  return { student, loading, error }
}
