import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyStudent() {
  console.log('🔍 Verifying Tan Wei Jie student data...\n')

  // 1. Get student basic info
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id, student_id, name')
    .eq('name', 'Tan Wei Jie')
    .single()

  if (studentError || !student) {
    console.error('❌ Student not found:', studentError)
    return
  }

  console.log('✅ Student found:')
  console.log(`   Name: ${student.name}`)
  console.log(`   ID (UUID): ${student.id}`)
  console.log(`   Student ID: ${student.student_id}\n`)

  // 2. Get private notes for this student
  const { data: notes, error: notesError } = await supabase
    .from('student_private_notes')
    .select('*')
    .eq('student_id', student.id)

  if (notesError) {
    console.error('❌ Error fetching notes:', notesError)
    return
  }

  console.log(`📝 Private notes count: ${notes?.length || 0}`)
  if (notes && notes.length > 0) {
    notes.forEach((note, index) => {
      console.log(`\n   Note ${index + 1}:`)
      console.log(`   - "${note.note}"`)
      console.log(`   - Created: ${new Date(note.created_at).toLocaleString('en-SG')}`)
      console.log(`   - Updated: ${new Date(note.updated_at).toLocaleString('en-SG')}`)
    })
  } else {
    console.log('   No notes found for this student')
  }
}

verifyStudent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
