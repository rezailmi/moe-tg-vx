import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkData() {
  const { data: teachers, error: teachersError } = await supabase
    .from('teachers')
    .select('*')

  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*')

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')

  const { data: guardians, error: guardiansError } = await supabase
    .from('parents_guardians')
    .select('*')

  console.log('\n📊 Database Contents:\n')
  console.log(`Teachers (${teachers?.length || 0}):`, teachersError || teachers)
  console.log(`\nClasses (${classes?.length || 0}):`, classesError || classes)
  console.log(`\nStudents (${students?.length || 0}):`, studentsError || students)
  console.log(`\nGuardians (${guardians?.length || 0}):`, guardiansError || guardians)
}

checkData()
