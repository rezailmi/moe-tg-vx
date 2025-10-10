import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mapSupabaseClassToClass, mapSupabaseClassToCCAClass } from '@/lib/supabase/adapters'
import type { Class, CCAClass } from '@/types/classroom'
import type { Database } from '@/types/database'

type ClassRow = Database['public']['Tables']['classes']['Row']

interface UseClassesResult {
  formClass: Class | null
  subjectClasses: Class[]
  ccaClasses: CCAClass[]
  loading: boolean
  error: Error | null
}

/**
 * Hook to fetch teacher's classes (form, subject, CCA)
 */
export function useClasses(teacherId: string): UseClassesResult {
  const [formClass, setFormClass] = useState<Class | null>(null)
  const [subjectClasses, setSubjectClasses] = useState<Class[]>([])
  const [ccaClasses, setCCAClasses] = useState<CCAClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!teacherId) return

    async function fetchClasses() {
      try {
        const supabase = createClient()

        // Fetch all classes where teacher is assigned
        const { data: teacherClasses, error: queryError } = await supabase
          .from('teacher_classes')
          .select(`
            role,
            class:classes(*)
          `)
          .eq('teacher_id', teacherId)

        if (queryError) throw queryError

        // For each class, get student count
        const classesWithCounts = await Promise.all(
          (teacherClasses || []).map(async (tc) => {
            if (typeof tc === 'object' && tc !== null && 'class' in tc) {
              const { count } = await supabase
                .from('student_classes')
                .select('*', { count: 'exact', head: true })
                .eq('class_id', (tc as { class: { id: string } }).class.id)

              return { ...(tc as object), studentCount: count || 0 }
            }
            return { ...(tc as object), studentCount: 0 }
          })
        )

        // Separate by type
        const form = classesWithCounts.find((tc) => typeof tc === 'object' && tc !== null && 'role' in tc && 'class' in tc && (tc as { role: string; class: { type: string } }).role === 'form_teacher' && (tc as { role: string; class: { type: string } }).class.type === 'form')
        const subjects = classesWithCounts.filter((tc) => typeof tc === 'object' && tc !== null && 'class' in tc && (tc as { class: { type: string } }).class.type === 'subject')
        const ccas = classesWithCounts.filter((tc) => typeof tc === 'object' && tc !== null && 'class' in tc && (tc as { class: { type: string } }).class.type === 'cca')

        // Map to frontend types
        if (form && typeof form === 'object' && 'class' in form && 'studentCount' in form) {
          setFormClass(mapSupabaseClassToClass(
            (form as { class: ClassRow }).class,
            teacherId,
            teacherId,
            (form as { studentCount: number }).studentCount
          ))
        }

        setSubjectClasses(
          subjects
            .filter((tc) => typeof tc === 'object' && 'class' in tc && 'studentCount' in tc)
            .map((tc) => mapSupabaseClassToClass(
              (tc as { class: ClassRow }).class,
              teacherId,
              undefined,
              (tc as { studentCount: number }).studentCount
            ))
        )

        setCCAClasses(
          ccas
            .filter((tc) => typeof tc === 'object' && 'class' in tc)
            .map((tc) => mapSupabaseClassToCCAClass(
              (tc as { class: ClassRow }).class,
              teacherId,
              [] // TODO: Fetch member IDs
            ))
        )
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [teacherId])

  return { formClass, subjectClasses, ccaClasses, loading, error }
}
