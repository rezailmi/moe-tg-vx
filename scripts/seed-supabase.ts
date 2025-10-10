import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import type { Database } from '@/types/database'

// Load environment variables
config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function clearAllTables() {
  console.log('🗑️  Clearing existing data...\n')

  const tables = [
    'report_comments',
    'reports',
    'case_issues',
    'cases',
    'behaviour_observations',
    'friend_relationships',
    'cce_results',
    'physical_fitness',
    'academic_results',
    'attendance',
    'student_private_notes',
    'student_overview',
    'student_classes',
    'student_guardians',
    'students',
    'parents_guardians',
    'teacher_classes',
    'classes',
    'teachers',
  ]

  for (const table of tables) {
    await supabase.from(table as any).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log(`  ✅ Cleared ${table}`)
  }

  console.log('\n✅ All tables cleared\n')
}

async function seedData() {
  console.log('🌱 Starting Supabase seeding...\n')

  try {
    // Clear existing data first
    await clearAllTables()

    // Generate UUIDs
    const teacherId = randomUUID()
    const class5AId = randomUUID()
    const scienceClassId = randomUUID()
    const footballCCAId = randomUUID()

    // 1. Create Teacher: Daniel Tan
    console.log('👨‍🏫 Creating teacher...')
    const teacher: Database['public']['Tables']['teachers']['Insert'] = {
      id: teacherId,
      name: 'Daniel Tan',
      email: 'daniel.tan@school.edu.sg',
      department: 'Mathematics',
      avatar: 'DT',
    }

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: teacherError } = await supabase
      .from('teachers')
      .upsert(teacher, { onConflict: 'email', ignoreDuplicates: false })

    if (teacherError) throw teacherError
    console.log('✅ Teacher created: Daniel Tan\n')

    // 2. Create Class 5A (Form Class & Math)
    console.log('🎓 Creating class 5A...')
    const class5A: Database['public']['Tables']['classes']['Insert'] = {
      id: class5AId,
      name: '5A',
      type: 'form',
      subject_name: 'Mathematics',
      year_level: '5',
      academic_year: '2025',
    }

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: classError } = await supabase
      .from('classes')
      .upsert(class5A, { onConflict: 'id' })

    if (classError) throw classError
    console.log('✅ Class created: 5A\n')

    // 3. Create Science Class for 5A
    console.log('🔬 Creating science class...')
    const science5A: Database['public']['Tables']['classes']['Insert'] = {
      id: scienceClassId,
      name: '5A Science',
      type: 'subject',
      subject_name: 'Science',
      year_level: '5',
      academic_year: '2025',
    }

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: scienceError } = await supabase
      .from('classes')
      .upsert(science5A, { onConflict: 'id' })

    if (scienceError) throw scienceError
    console.log('✅ Science class created\n')

    // 4. Create Football CCA
    console.log('⚽ Creating Football CCA...')
    const footballCCA: Database['public']['Tables']['classes']['Insert'] = {
      id: footballCCAId,
      name: 'Football CCA',
      type: 'cca',
      subject_name: null,
      year_level: '5',
      academic_year: '2025',
    }

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: ccaError } = await supabase
      .from('classes')
      .upsert(footballCCA, { onConflict: 'id' })

    if (ccaError) throw ccaError
    console.log('✅ Football CCA created\n')

    // 5. Assign Daniel Tan as Form Teacher and Subject Teacher
    console.log('📋 Assigning teacher to classes...')
    const assignments: Database['public']['Tables']['teacher_classes']['Insert'][] = [
      {
        teacher_id: teacherId,
        class_id: class5AId,
        role: 'form_teacher',
      },
      {
        teacher_id: teacherId,
        class_id: scienceClassId,
        role: 'teacher',
      },
    ]

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: assignError } = await supabase
      .from('teacher_classes')
      .upsert(assignments)

    if (assignError) throw assignError
    console.log('✅ Teacher assignments created\n')

    // 6. Create 10 Students with Singapore names
    console.log('👨‍🎓 Creating 10 students...')
    const singaporeStudents = [
      { name: 'Tan Wei Jie', gender: 'M', admission_number: 'ADM2020001' },
      { name: 'Lee Hui Min', gender: 'F', admission_number: 'ADM2020002' },
      { name: 'Lim Kai Wen', gender: 'M', admission_number: 'ADM2020003' },
      { name: 'Ng Xin Yi', gender: 'F', admission_number: 'ADM2020004' },
      { name: 'Ong Jun Wei', gender: 'M', admission_number: 'ADM2020005' },
      { name: 'Chen Mei Ling', gender: 'F', admission_number: 'ADM2020006' },
      { name: 'Koh Zhi Hao', gender: 'M', admission_number: 'ADM2020007' },
      { name: 'Teo Yi Ting', gender: 'F', admission_number: 'ADM2020008' },
      { name: 'Goh Rui En', gender: 'M', admission_number: 'ADM2020009' },
      { name: 'Chua Li Hua', gender: 'F', admission_number: 'ADM2020010' },
    ]

    // Create guardians and students
    const studentIds: string[] = []
    for (let i = 0; i < singaporeStudents.length; i++) {
      const student = singaporeStudents[i]
      const studentId = randomUUID()
      const guardianId = randomUUID()
      studentIds.push(studentId)

      // Create guardian (parent)
      const guardian: Database['public']['Tables']['parents_guardians']['Insert'] = {
        id: guardianId,
        name: `${student.name.split(' ')[0]} ${student.name.split(' ')[1]} (Parent)`,
        relationship: 'Parent',
        phone: `+65 9${Math.floor(100 + Math.random() * 900)}${Math.floor(1000 + Math.random() * 9000)}`,
        email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@parent.sg`,
      }

      // @ts-expect-error - Supabase type inference issue with upsert
      const { error: guardianError } = await supabase
        .from('parents_guardians')
        .upsert(guardian, { onConflict: 'id' })

      if (guardianError) throw guardianError

      // Create student
      const studentData: Database['public']['Tables']['students']['Insert'] = {
        id: studentId,
        student_id: student.admission_number,
        name: student.name,
        year_level: '5',
        form_teacher_id: teacherId,
        primary_guardian_id: guardianId,
        date_of_birth: `201${i % 4}-0${(i % 9) + 1}-${10 + (i % 20)}`,
        gender: student.gender === 'M' ? 'male' : 'female',
        nationality: 'Singaporean',
        academic_year: '2025',
      }

      // @ts-expect-error - Supabase type inference issue with upsert
      const { error: studentError } = await supabase
        .from('students')
        .upsert(studentData, { onConflict: 'id' })

      if (studentError) throw studentError

      console.log(`  ✅ ${student.name}`)
    }

    console.log('\n✅ All 10 students created\n')

    // 7. Enroll all students in Math and Science classes
    console.log('📚 Enrolling students in classes...')
    const enrollments: Database['public']['Tables']['student_classes']['Insert'][] = []

    studentIds.forEach((studentId) => {
      // Math class enrollment
      enrollments.push({
        student_id: studentId,
        class_id: class5AId,
        status: 'active',
      })
      // Science class enrollment
      enrollments.push({
        student_id: studentId,
        class_id: scienceClassId,
        status: 'active',
      })
    })

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: enrollError } = await supabase
      .from('student_classes')
      .upsert(enrollments)

    if (enrollError) throw enrollError
    console.log('✅ All students enrolled in Math and Science\n')

    // 8. Enroll 5 students in Football CCA
    console.log('⚽ Enrolling 5 students in Football CCA...')
    const footballStudents = studentIds.slice(0, 5)
    const footballEnrollments: Database['public']['Tables']['student_classes']['Insert'][] =
      footballStudents.map((studentId) => ({
        student_id: studentId,
        class_id: footballCCAId,
        status: 'active',
      }))

    // @ts-expect-error - Supabase type inference issue with upsert
    const { error: footballEnrollError } = await supabase
      .from('student_classes')
      .upsert(footballEnrollments)

    if (footballEnrollError) throw footballEnrollError
    console.log('✅ 5 students enrolled in Football CCA\n')

    console.log('🎉 Seeding completed successfully!\n')
    console.log('📊 Summary:')
    console.log('   - 1 Teacher: Daniel Tan')
    console.log('   - 3 Classes: 5A (Math), 5A Science, Football CCA')
    console.log('   - 10 Students with Singapore names')
    console.log('   - 10 Guardians (parents)')
    console.log('   - All students in Math & Science')
    console.log('   - 5 students in Football CCA\n')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedData()
