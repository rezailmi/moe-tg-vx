import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('id, student_id, name')
    .order('name')

  console.log('Students in database:')
  console.log(JSON.stringify(data, null, 2))

  if (error) {
    console.error('Error:', error)
  }
}

checkStudents()
