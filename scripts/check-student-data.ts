import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkStudentData() {
  console.log('\n🔍 Checking Student Data\n')

  // Get first student
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .limit(1)

  if (!students || students.length === 0) {
    console.log('❌ No students found')
    return
  }

  const student = students[0]
  console.log('📚 Student:', student.name, `(${student.student_id})`)
  console.log('   ID:', student.id)

  // Check guardian
  const { data: guardian } = await supabase
    .from('parents_guardians')
    .select('*')
    .eq('id', student.primary_guardian_id)
    .single()

  console.log('\n👨‍👩‍👧 Guardian:', guardian ? `✅ ${guardian.name}` : '❌ None')

  // Check cases
  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .eq('student_id', student.id)

  console.log('📋 Cases:', cases ? `${cases.length} cases` : '❌ None')

  // Check reports
  const { data: reports } = await supabase
    .from('reports')
    .select('*')

  console.log('📄 Reports (all):', reports ? `${reports.length} reports` : '❌ None')

  // Check attendance
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', student.id)

  console.log('📅 Attendance records:', attendance ? `${attendance.length} records` : '❌ None')

  // Check academic results
  const { data: academic } = await supabase
    .from('academic_results')
    .select('*')
    .eq('student_id', student.id)

  console.log('📊 Academic results:', academic ? `${academic.length} records` : '❌ None')

  // Check student overview
  const { data: overview } = await supabase
    .from('student_overview')
    .select('*')
    .eq('student_id', student.id)

  console.log('📝 Student overview:', overview && overview.length > 0 ? '✅ Exists' : '❌ None')

  // Check physical fitness
  const { data: fitness } = await supabase
    .from('physical_fitness')
    .select('*')
    .eq('student_id', student.id)

  console.log('💪 Physical fitness:', fitness ? `${fitness.length} records` : '❌ None')

  // Check CCE results
  const { data: cce } = await supabase
    .from('cce_results')
    .select('*')
    .eq('student_id', student.id)

  console.log('🎯 CCE results:', cce ? `${cce.length} records` : '❌ None')

  // Check behaviour observations
  const { data: behaviour } = await supabase
    .from('behaviour_observations')
    .select('*')
    .eq('student_id', student.id)

  console.log('👀 Behaviour observations:', behaviour ? `${behaviour.length} records` : '❌ None')

  // Check friend relationships
  const { data: friends } = await supabase
    .from('friend_relationships')
    .select('*')
    .or(`student1_id.eq.${student.id},student2_id.eq.${student.id}`)

  console.log('👥 Friend relationships:', friends ? `${friends.length} relationships` : '❌ None')

  console.log('\n📊 Summary:')
  console.log('   - Guardian: ✅')
  console.log('   - Cases: ❌ Need to seed')
  console.log('   - Attendance: ❌ Need to seed')
  console.log('   - Academic results: ❌ Need to seed')
  console.log('   - Student overview: ❌ Need to seed')
  console.log('   - Physical fitness: ❌ Need to seed')
  console.log('   - CCE results: ❌ Need to seed')
  console.log('   - Behaviour: ❌ Need to seed')
  console.log('   - Friends: ❌ Need to seed\n')
}

checkStudentData()
