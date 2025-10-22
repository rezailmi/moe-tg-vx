// Mock data for Classroom module
import type {
  User,
  Class,
  CCAClass,
  Student,
  AttendanceRecord,
  ClassAlert,
  ActivityLog,
  ClassOverviewStats,
} from '@/types/classroom'

// Import Eric's comprehensive records
export { ericStudentRecords, getEricRecordsByType, getEricRecentRecords, getEricCounselingSessions, getEricTermlyCheckIns, getEricPTMPrepNotes } from './eric-records'

// Current logged-in user (Form Teacher for 5A, Subject Teacher for 6B and 7A)
export const currentUser: User = {
  user_id: 'teacher-001',
  name: 'Daniel Tan',
  email: 'daniel.tan@school.edu.sg',
  role: 'FormTeacher',
  department: 'Mathematics',
  classes_assigned: ['class-5a', 'class-6b', 'class-7a'],
  form_class_id: 'class-5a',
  cca_classes: ['cca-math-club', 'cca-robotics'],
  avatar: 'DT',
}

// Mock Classes
export const mockClasses: Class[] = [
  {
    class_id: 'class-5a',
    class_name: '5A',
    subject: 'Mathematics',
    year_level: 5,
    teacher_id: 'teacher-001',
    form_teacher_id: 'teacher-001',
    students: [], // Will populate with student IDs
    schedule: [
      { day: 'Monday', start_time: '08:00', end_time: '09:00', location: 'Room 3-12' },
      { day: 'Wednesday', start_time: '08:00', end_time: '09:00', location: 'Room 3-12' },
      { day: 'Friday', start_time: '08:00', end_time: '09:00', location: 'Room 3-12' },
    ],
    academic_year: '2025',
    is_form_class: true,
    student_count: 30,
  },
  {
    class_id: 'class-6b',
    class_name: '6B',
    subject: 'Mathematics',
    year_level: 6,
    teacher_id: 'teacher-001',
    form_teacher_id: 'teacher-002',
    students: [],
    schedule: [
      { day: 'Tuesday', start_time: '09:00', end_time: '10:00', location: 'Room 3-12' },
      { day: 'Thursday', start_time: '09:00', end_time: '10:00', location: 'Room 3-12' },
    ],
    academic_year: '2025',
    is_form_class: false,
    student_count: 28,
  },
  {
    class_id: 'class-7a',
    class_name: '7A',
    subject: 'Mathematics',
    year_level: 7,
    teacher_id: 'teacher-001',
    form_teacher_id: 'teacher-003',
    students: [],
    schedule: [
      { day: 'Monday', start_time: '10:00', end_time: '11:00', location: 'Room 3-12' },
      { day: 'Wednesday', start_time: '10:00', end_time: '11:00', location: 'Room 3-12' },
      { day: 'Friday', start_time: '10:00', end_time: '11:00', location: 'Room 3-12' },
    ],
    academic_year: '2025',
    is_form_class: false,
    student_count: 30,
  },
]

// Mock CCA Classes
export const mockCCAClasses: CCAClass[] = [
  {
    cca_id: 'cca-math-club',
    name: 'Math Olympiad Club',
    type: 'Clubs',
    teacher_in_charge: 'teacher-001',
    members: ['student-001', 'student-003', 'student-005', 'student-007', 'student-009',
              'student-011', 'student-013', 'student-015', 'student-017', 'student-019',
              'student-021', 'student-023'],
    schedule: [
      { day: 'Thursday', start_time: '15:00', end_time: '17:00', location: 'Math Lab' },
    ],
  },
  {
    cca_id: 'cca-robotics',
    name: 'Robotics Club',
    type: 'Clubs',
    teacher_in_charge: 'teacher-001',
    members: ['student-002', 'student-004', 'student-006', 'student-008', 'student-010',
              'student-012', 'student-014', 'student-016', 'student-018', 'student-020'],
    schedule: [
      { day: 'Tuesday', start_time: '15:00', end_time: '17:00', location: 'Computer Lab 2' },
      { day: 'Friday', start_time: '14:00', end_time: '16:00', location: 'Computer Lab 2' },
    ],
  },
]

// Mock Students for Class 5A (Form Class)
// TODO: Replace with Supabase queries to fetch students from database
// Mock data has been migrated to Supabase (see migration 20250122000001_add_12_case_students_primary_5a.sql)
export const mockStudents5A: Student[] = []


// Mock Attendance Records for today
export const mockAttendanceToday: AttendanceRecord[] = [
  {
    attendance_id: 'att-001',
    student_id: 'student-002',
    class_id: 'class-5a',
    date: '2025-10-08',
    status: 'Absent',
    reason: 'Sick',
    notes: 'Parent called - fever',
    recorded_by: 'teacher-001',
    recorded_at: '2025-10-08T08:15:00Z',
    parent_notified: true,
  },
  {
    attendance_id: 'att-002',
    student_id: 'student-003',
    class_id: 'class-5a',
    date: '2025-10-08',
    status: 'Absent',
    reason: 'Medical Appointment',
    notes: 'Pre-approved',
    recorded_by: 'teacher-001',
    recorded_at: '2025-10-08T08:15:00Z',
    parent_notified: true,
  },
]

// Mock Class Alerts
export const mockClassAlerts: ClassAlert[] = [
  {
    alert_id: 'alert-001',
    class_id: 'class-5a',
    type: 'Academic',
    severity: 'Urgent',
    title: 'Assignment Grading Deadline Tomorrow',
    description: '15 assignments pending grade entry. Deadline: Oct 9, 5:00 PM',
    created_date: '2025-10-08T06:00:00Z',
    due_date: '2025-10-09T17:00:00Z',
    status: 'Active',
    quick_actions: [
      { action_id: 'act-001', label: 'Enter Grades Now', action: '/classroom/class-5a/academic/grades' },
      { action_id: 'act-002', label: 'Request Extension', action: '/classroom/class-5a/academic/grades/extend', variant: 'outline' },
    ],
  },
  {
    alert_id: 'alert-002',
    class_id: 'class-5a',
    student_id: 'student-002',
    type: 'Attendance',
    severity: 'Urgent',
    title: 'Student Excessive Absences',
    description: 'David Chen: 3 consecutive absences. Parent contact required.',
    created_date: '2025-10-08T08:30:00Z',
    status: 'Active',
    quick_actions: [
      { action_id: 'act-003', label: 'Contact Parent', action: '/classroom/class-5a/communication/new' },
      { action_id: 'act-004', label: 'View Attendance', action: '/classroom/class-5a/attendance/view/student-002', variant: 'outline' },
      { action_id: 'act-005', label: 'Create Intervention', action: '/classroom/class-5a/cases/new', variant: 'outline' },
    ],
  },
  {
    alert_id: 'alert-003',
    class_id: 'class-5a',
    student_id: 'student-003',
    type: 'Academic',
    severity: 'High',
    title: 'Declining Performance Alert',
    description: 'Emily Tan: -15% drop in 2 subjects. Requires intervention discussion.',
    created_date: '2025-10-07T14:00:00Z',
    status: 'Active',
    quick_actions: [
      { action_id: 'act-006', label: 'View Performance', action: '/classroom/students/student-003/academic' },
      { action_id: 'act-007', label: 'Schedule Meeting', action: '/classroom/class-5a/communication/schedule', variant: 'outline' },
    ],
  },
  {
    alert_id: 'alert-004',
    class_id: 'class-5a',
    type: 'Administrative',
    severity: 'High',
    title: 'Permission Slips Pending',
    description: '5 students: Field trip consent pending. Deadline: Oct 12',
    created_date: '2025-10-06T10:00:00Z',
    due_date: '2025-10-12T23:59:00Z',
    status: 'Active',
    quick_actions: [
      { action_id: 'act-008', label: 'Send Reminder', action: '/classroom/class-5a/documents/remind' },
      { action_id: 'act-009', label: 'View Status', action: '/classroom/class-5a/documents', variant: 'outline' },
    ],
  },
  {
    alert_id: 'alert-005',
    class_id: 'class-5a',
    type: 'Wellbeing',
    severity: 'Medium',
    title: 'Wellbeing Check-ins Overdue',
    description: '3 students: Last check-in >2 weeks ago',
    created_date: '2025-10-05T09:00:00Z',
    status: 'Active',
    quick_actions: [
      { action_id: 'act-010', label: 'Conduct Check-ins', action: '/classroom/class-5a/wellbeing' },
      { action_id: 'act-011', label: 'View List', action: '/classroom/class-5a/wellbeing/overdue', variant: 'outline' },
    ],
  },
]

// Mock Activity Log
export const mockActivityLog: ActivityLog[] = [
  {
    activity_id: 'activity-001',
    class_id: 'class-5a',
    student_id: 'student-005',
    type: 'Assignment',
    description: 'Assignment submitted (Sarah Lee)',
    performed_by: 'student-005',
    date: '2025-10-08T06:00:00Z',
  },
  {
    activity_id: 'activity-002',
    class_id: 'class-5a',
    student_id: 'student-002',
    type: 'Attendance',
    description: 'Absence recorded (David Chen - Sick)',
    performed_by: 'teacher-001',
    date: '2025-10-08T03:00:00Z',
  },
  {
    activity_id: 'activity-003',
    class_id: 'class-5a',
    type: 'Grade',
    description: 'Quiz 5 grades published (Average: 81%)',
    performed_by: 'teacher-001',
    date: '2025-10-07T00:00:00Z',
  },
  {
    activity_id: 'activity-004',
    class_id: 'class-5a',
    student_id: 'student-010',
    type: 'Case',
    description: 'Behavioral incident (Michael Wong)',
    performed_by: 'teacher-001',
    date: '2025-10-06T00:00:00Z',
  },
]

// Mock Class Overview Stats
export const mockClassOverviewStats: ClassOverviewStats = {
  class_id: 'class-5a',
  date: '2025-10-08',
  attendance: {
    present: 28,
    absent: 2,
    late: 0,
    excused: 0,
    rate: 93.3,
  },
  academic: {
    pending_grades: 15,
    class_average: 78.5,
    upcoming_assessments: 2,
  },
  alerts: {
    urgent: 2,
    high: 3,
    medium: 2,
    low: 0,
    total: 7,
  },
}

// Helper function to get class by ID
export function getClassById(classId: string): Class | undefined {
  return mockClasses.find((c) => c.class_id === classId)
}

// Helper function to get students by class ID
export function getStudentsByClassId(classId: string): Student[] {
  if (classId === 'class-5a') {
    return mockStudents5A
  }
  // Add other classes as needed
  return []
}

// Helper function to get student by name
export function getStudentByName(studentName: string): Student | undefined {
  // Search across all student arrays
  const allStudents = [...mockStudents5A] // Add other class arrays as they're created
  return allStudents.find((student) => student.name === studentName)
}

// Helper function to get student by ID
export function getStudentById(studentId: string): Student | undefined {
  // Search across all student arrays
  const allStudents = [...mockStudents5A] // Add other class arrays as they're created
  return allStudents.find((student) => student.student_id === studentId)
}

// Helper function to get alerts by class ID
export function getAlertsByClassId(classId: string): ClassAlert[] {
  return mockClassAlerts.filter((alert) => alert.class_id === classId && alert.status === 'Active')
}

// Helper function to get activity log by class ID
export function getActivityLogByClassId(classId: string): ActivityLog[] {
  return mockActivityLog.filter((activity) => activity.class_id === classId)
}

// Helper function to get class overview stats
export function getClassOverviewStats(classId: string): ClassOverviewStats | undefined {
  if (classId === 'class-5a') {
    return mockClassOverviewStats
  }
  return undefined
}
