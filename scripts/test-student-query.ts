import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function testQuery() {
  const studentName = 'Koh Zhi Hao'

  console.log('\n1. Testing basic query without joins...')
  const { data: basic, error: basicError } = await supabase
    .from('students')
    .select('*')
    .eq('name', studentName)
    .single()

  if (basicError) {
    console.error('Basic query error:', basicError)
  } else {
    console.log('Basic student data:', JSON.stringify(basic, null, 2))
  }

  console.log('\n2. Testing with form_class join...')
  const { data: withClass, error: classError } = await supabase
    .from('students')
    .select(`
      id,
      student_id,
      name,
      year_level,
      form_class_id,
      classes:form_class_id(
        id,
        name
      )
    `)
    .eq('name', studentName)
    .single()

  if (classError) {
    console.error('Class join error:', classError)
  } else {
    console.log('With class data:', JSON.stringify(withClass, null, 2))
  }

  console.log('\n3. Testing with guardian join...')
  const { data: withGuardian, error: guardianError } = await supabase
    .from('students')
    .select(`
      id,
      student_id,
      name,
      primary_guardian_id,
      parents_guardians:primary_guardian_id(
        name,
        email,
        phone_number,
        relationship
      )
    `)
    .eq('name', studentName)
    .single()

  if (guardianError) {
    console.error('Guardian join error:', guardianError)
  } else {
    console.log('With guardian data:', JSON.stringify(withGuardian, null, 2))
  }
}

testQuery()
