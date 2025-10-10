import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedPrivateNotes() {
  console.log('🌱 Seeding private notes...')

  // Get existing students
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, name')
    .limit(5)

  if (studentsError || !students || students.length === 0) {
    console.error('❌ Error fetching students:', studentsError)
    return
  }

  console.log(`✅ Found ${students.length} students`)

  // Get a teacher ID for created_by
  const { data: teacher } = await supabase
    .from('teachers')
    .select('id')
    .limit(1)
    .single()

  if (!teacher) {
    console.error('❌ No teacher found')
    return
  }

  // Sample private notes for different students
  const privateNotes = [
    {
      student_id: students[0].id,
      note: 'Parent requested extra attention in mathematics. Student responds well to visual learning aids.',
      created_by: teacher.id,
    },
    {
      student_id: students[1].id,
      note: 'Excellent progress this term. Consider recommending for advanced program.',
      created_by: teacher.id,
    },
    {
      student_id: students[2].id,
      note: 'Student has been experiencing family issues at home. Monitor emotional wellbeing closely. Has shown resilience and maintains good academic performance.',
      created_by: teacher.id,
    },
    {
      student_id: students[3].id,
      note: 'Tends to be shy in group settings. Encourage participation in class discussions.',
      created_by: teacher.id,
    },
    {
      student_id: students[4].id,
      note: 'Strong leadership qualities. Would be a good candidate for class monitor role next term.',
      created_by: teacher.id,
    },
  ]

  // Insert private notes
  const { data: insertedNotes, error: insertError } = await supabase
    .from('student_private_notes')
    .insert(privateNotes)
    .select()

  if (insertError) {
    console.error('❌ Error inserting private notes:', insertError)
    return
  }

  console.log(`✅ Inserted ${insertedNotes?.length || 0} private notes`)

  // Display summary
  console.log('\n📝 Private Notes Summary:')
  students.forEach((student, index) => {
    if (index < privateNotes.length) {
      console.log(`  - ${student.name}: "${privateNotes[index].note.substring(0, 60)}..."`)
    }
  })
}

seedPrivateNotes()
  .then(() => {
    console.log('\n✅ Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
