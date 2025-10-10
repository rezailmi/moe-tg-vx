'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useClassName(classId: string | undefined) {
  const [className, setClassName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClassName() {
      if (!classId) {
        setClassName(null)
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('classes')
          .select('name')
          .eq('id', classId)
          .single()

        if (error) {
          console.error('Error fetching class name:', error)
          setClassName(null)
        } else if (data && typeof data === 'object' && 'name' in data) {
          setClassName((data as { name: string }).name)
        } else {
          setClassName(null)
        }
      } catch (err) {
        console.error('Error in useClassName:', err)
        setClassName(null)
      } finally {
        setLoading(false)
      }
    }

    fetchClassName()
  }, [classId])

  return { className, loading }
}
