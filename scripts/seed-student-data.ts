import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedStudentData() {
  console.log('\n🌱 Seeding Student Data\n')

  // Get all students
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')

  if (studentsError || !students) {
    console.error('❌ Error fetching students:', studentsError)
    return
  }

  console.log(`📚 Found ${students.length} students\n`)

  // Get teacher ID for Daniel Tan
  const { data: teacher } = await supabase
    .from('teachers')
    .select('id')
    .eq('email', 'daniel.tan@school.edu.sg')
    .single()

  const teacherId = teacher?.id

  // 1. Seed student_overview
  console.log('📝 Seeding student overview...')
  const overviews = students.map((student) => ({
    student_id: student.id,
    background: `${student.name} is a dedicated student who shows consistent effort in class.`,
    medical_conditions: null,
    health_declaration: null,
    mental_wellness: { status: 'good', notes: 'No concerns' },
    family: { structure: 'Nuclear family', notes: 'Supportive home environment' },
    housing_finance: null,
    is_swan: false,
    swan_details: null,
  }))

  const { error: overviewError } = await supabase
    .from('student_overview')
    .insert(overviews)

  if (overviewError) {
    console.error('❌ Error seeding overview:', overviewError)
  } else {
    console.log(`✅ Seeded ${overviews.length} student overviews`)
  }

  // 2. Seed academic_results
  console.log('📊 Seeding academic results...')
  const subjects = ['English', 'Mathematics', 'Science', 'History', 'Geography']
  const academicResults = []

  for (const student of students) {
    for (const subject of subjects) {
      // Term 1 exam
      const score1 = Math.floor(Math.random() * 30) + 60
      academicResults.push({
        student_id: student.id,
        assessment_type: 'Mid-Year Examination',
        assessment_name: `${subject} Mid-Year Exam`,
        assessment_date: '2024-06-15',
        term: 'Term 1',
        score: score1,
        max_score: 100,
        percentage: score1,
        grade: calculateGrade(score1),
        remarks: { comment: 'Good performance' },
        created_by: teacherId,
      })

      // Term 2 exam
      const score2 = Math.floor(Math.random() * 30) + 65
      academicResults.push({
        student_id: student.id,
        assessment_type: 'End-of-Year Examination',
        assessment_name: `${subject} End-of-Year Exam`,
        assessment_date: '2024-11-20',
        term: 'Term 2',
        score: score2,
        max_score: 100,
        percentage: score2,
        grade: calculateGrade(score2),
        remarks: { comment: 'Showing improvement' },
        created_by: teacherId,
      })
    }
  }

  const { error: academicError } = await supabase
    .from('academic_results')
    .insert(academicResults)

  if (academicError) {
    console.error('❌ Error seeding academic results:', academicError)
  } else {
    console.log(`✅ Seeded ${academicResults.length} academic results`)
  }

  // 3. Seed attendance
  console.log('📅 Seeding attendance records...')
  const attendanceRecords = []
  const startDate = new Date('2024-01-02')
  const endDate = new Date('2024-12-20')
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      for (const student of students) {
        const randomStatus = Math.random()
        let status: 'present' | 'absent' | 'late' | 'early_dismissal' = 'present'
        let reason = null

        if (randomStatus > 0.95) {
          status = 'absent'
          reason = ['Sick', 'Medical Appointment', 'Family Emergency'][Math.floor(Math.random() * 3)]
        } else if (randomStatus > 0.90) {
          status = 'late'
        } else if (randomStatus > 0.88) {
          status = 'early_dismissal'
          reason = 'Pre-approved Leave'
        }

        attendanceRecords.push({
          student_id: student.id,
          date: currentDate.toISOString().split('T')[0],
          type: 'daily' as const,
          status,
          is_official: true,
          reason,
          remarks: status === 'absent' ? 'Parent notified' : null,
          recorded_by: teacherId,
        })
      }
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Insert in batches of 500
  const batchSize = 500
  for (let i = 0; i < attendanceRecords.length; i += batchSize) {
    const batch = attendanceRecords.slice(i, i + batchSize)
    const { error: attendanceError } = await supabase
      .from('attendance')
      .insert(batch)

    if (attendanceError) {
      console.error(`❌ Error seeding attendance batch ${i / batchSize + 1}:`, attendanceError)
    }
  }
  console.log(`✅ Seeded ${attendanceRecords.length} attendance records`)

  // 4. Seed cases
  console.log('📋 Seeding cases...')
  const cases = [
    // Discipline case for student 1
    {
      student_id: students[0].id,
      case_type: 'discipline' as const,
      severity: 'medium' as const,
      status: 'in_progress' as const,
      title: 'Repeated Late Submissions',
      description: 'Student has been submitting assignments late for the past 3 weeks.',
      created_by: teacherId,
      opened_date: '2024-11-01',
      assigned_to: teacherId,
      guardian_notified: true,
      guardian_notified_date: '2024-11-02',
      guardian_notification_method: 'email',
      tags: ['academic', 'time-management'],
    },
    // Counselling case for student 2
    {
      student_id: students[1].id,
      case_type: 'counselling' as const,
      severity: 'high' as const,
      status: 'in_progress' as const,
      title: 'Social Adjustment Issues',
      description: 'Student appears withdrawn and has difficulty making friends in class.',
      created_by: teacherId,
      opened_date: '2024-10-15',
      assigned_to: teacherId,
      guardian_notified: true,
      guardian_notified_date: '2024-10-16',
      guardian_notification_method: 'phone',
      tags: ['wellbeing', 'social'],
    },
    // SEN case for student 3
    {
      student_id: students[2].id,
      case_type: 'sen' as const,
      severity: 'medium' as const,
      status: 'open' as const,
      title: 'Learning Support Required',
      description: 'Student requires additional time for assessments and benefits from visual aids.',
      created_by: teacherId,
      opened_date: '2024-09-01',
      assigned_to: teacherId,
      guardian_notified: true,
      guardian_notified_date: '2024-09-02',
      guardian_notification_method: 'meeting',
      tags: ['sen', 'accommodations'],
    },
    // Resolved discipline case
    {
      student_id: students[3].id,
      case_type: 'discipline' as const,
      severity: 'low' as const,
      status: 'closed' as const,
      title: 'Minor Classroom Disruption',
      description: 'Student was talking during lessons.',
      created_by: teacherId,
      opened_date: '2024-09-10',
      closed_date: '2024-09-25',
      assigned_to: teacherId,
      guardian_notified: false,
      tags: ['behavior'],
    },
  ]

  const { error: casesError } = await supabase
    .from('cases')
    .insert(cases)

  if (casesError) {
    console.error('❌ Error seeding cases:', casesError)
  } else {
    console.log(`✅ Seeded ${cases.length} cases`)
  }

  // 5. Seed CCE results
  console.log('🎯 Seeding CCE results...')
  const cceResults = []

  for (const student of students) {
    // Term 1
    cceResults.push({
      student_id: student.id,
      term: 'Term 1',
      academic_year: '2024',
      character: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      citizenship: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      education: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      overall_grade: 'B',
      comments: 'Shows good character development and active citizenship.',
      assessed_by: teacherId,
    })
    // Term 2
    cceResults.push({
      student_id: student.id,
      term: 'Term 2',
      academic_year: '2024',
      character: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      citizenship: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      education: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      overall_grade: 'B',
      comments: 'Continued improvement in character and values.',
      assessed_by: teacherId,
    })
  }

  const { error: cceError } = await supabase
    .from('cce_results')
    .insert(cceResults)

  if (cceError) {
    console.error('❌ Error seeding CCE results:', cceError)
  } else {
    console.log(`✅ Seeded ${cceResults.length} CCE results`)
  }

  // 6. Seed physical fitness
  console.log('💪 Seeding physical fitness records...')
  const fitnessRecords = []

  for (const student of students) {
    fitnessRecords.push({
      student_id: student.id,
      assessment_date: '2024-03-15',
      assessment_type: 'NAPFA',
      metrics: {
        sit_ups: Math.floor(Math.random() * 20) + 30,
        push_ups: Math.floor(Math.random() * 15) + 15,
        shuttle_run_seconds: Math.random() * 2 + 8,
        sit_reach_cm: Math.floor(Math.random() * 20) + 20,
        standing_broad_jump_cm: Math.floor(Math.random() * 40) + 160,
      },
      overall_grade: ['Gold', 'Silver', 'Bronze', 'Pass'][Math.floor(Math.random() * 4)],
      pass_status: true,
      remarks: 'Good physical fitness level',
      assessed_by: teacherId,
    })
  }

  const { error: fitnessError } = await supabase
    .from('physical_fitness')
    .insert(fitnessRecords)

  if (fitnessError) {
    console.error('❌ Error seeding fitness records:', fitnessError)
  } else {
    console.log(`✅ Seeded ${fitnessRecords.length} fitness records`)
  }

  // 7. Seed behaviour observations
  console.log('👀 Seeding behaviour observations...')
  const behaviourObs = []

  for (let i = 0; i < students.length; i++) {
    if (i % 2 === 0) {
      // Positive observations for some students
      behaviourObs.push({
        student_id: students[i].id,
        observation_date: '2024-11-20',
        observed_by: teacherId!,
        category: 'positive',
        title: 'Helpful Peer Support',
        description: 'Helped a classmate understand difficult math concept during group work.',
        severity: 'low' as const,
        action_taken: 'Praised student and encouraged peer tutoring.',
        requires_follow_up: false,
      })
    } else {
      // Neutral/concern observations
      behaviourObs.push({
        student_id: students[i].id,
        observation_date: '2024-11-15',
        observed_by: teacherId!,
        category: 'concern',
        title: 'Distracted in Class',
        description: 'Seems distracted during lessons, often looking out the window.',
        severity: 'low' as const,
        action_taken: 'Spoke with student, will monitor and consider seating change.',
        requires_follow_up: true,
        follow_up_date: '2024-12-01',
      })
    }
  }

  const { error: behaviourError } = await supabase
    .from('behaviour_observations')
    .insert(behaviourObs)

  if (behaviourError) {
    console.error('❌ Error seeding behaviour observations:', behaviourError)
  } else {
    console.log(`✅ Seeded ${behaviourObs.length} behaviour observations`)
  }

  // 8. Seed friend relationships
  console.log('👥 Seeding friend relationships...')
  const friendRelationships = [
    {
      student_id: students[0].id,
      friend_id: students[1].id,
      relationship_type: 'best_friend',
      closeness_level: 'very_close' as const,
      notes: 'Often seen studying together',
      observed_by: teacherId,
      observation_date: '2024-09-01',
    },
    {
      student_id: students[0].id,
      friend_id: students[2].id,
      relationship_type: 'classmate',
      closeness_level: 'acquaintance' as const,
      observed_by: teacherId,
      observation_date: '2024-09-01',
    },
    {
      student_id: students[1].id,
      friend_id: students[3].id,
      relationship_type: 'best_friend',
      closeness_level: 'very_close' as const,
      notes: 'Known each other since primary school',
      observed_by: teacherId,
      observation_date: '2024-09-01',
    },
    {
      student_id: students[2].id,
      friend_id: students[4].id,
      relationship_type: 'classmate',
      closeness_level: 'close' as const,
      observed_by: teacherId,
      observation_date: '2024-09-01',
    },
    {
      student_id: students[3].id,
      friend_id: students[5].id,
      relationship_type: 'best_friend',
      closeness_level: 'very_close' as const,
      observed_by: teacherId,
      observation_date: '2024-09-01',
    },
  ]

  const { error: friendsError } = await supabase
    .from('friend_relationships')
    .insert(friendRelationships)

  if (friendsError) {
    console.error('❌ Error seeding friend relationships:', friendsError)
  } else {
    console.log(`✅ Seeded ${friendRelationships.length} friend relationships`)
  }

  console.log('\n✅ Student data seeding complete!\n')
}

// Helper function
function calculateGrade(score: number): string {
  if (score >= 85) return 'A'
  if (score >= 75) return 'B'
  if (score >= 65) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

seedStudentData()
