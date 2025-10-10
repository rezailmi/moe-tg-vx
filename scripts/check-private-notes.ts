import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPrivateNotes() {
  console.log('📋 Checking students with private notes...\n')

  const { data: notes, error } = await supabase
    .from('student_private_notes')
    .select(`
      id,
      note,
      created_at,
      students:student_id (
        name,
        student_id
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  if (!notes || notes.length === 0) {
    console.log('No private notes found')
    return
  }

  console.log(`Found ${notes.length} private notes:\n`)

  notes.forEach((note: any, index: number) => {
    console.log(`${index + 1}. 📝 ${note.students.name} (Student ID: ${note.students.student_id})`)
    console.log(`   Note: "${note.note}"`)
    console.log(`   Created: ${new Date(note.created_at).toLocaleString('en-SG')}\n`)
  })
}

checkPrivateNotes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
