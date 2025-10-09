// Student Records & Report Slip Type Definitions

export type RecordType = 'attendance' | 'performance' | 'profile' | 'case-related'

export type AttendanceSubType = 'daily' | 'cca' | 'school-events' | 'early-dismissal'
export type PerformanceSubType = 'academic-results' | 'character-cce' | 'cca' | 'physical-fitness'
export type ProfileSubType =
  | 'health-declaration'
  | 'mental-wellness'
  | 'family'
  | 'housing-finance'
  | 'social-behaviour'
  | 'friend-relationships'
  | 'character-observations'

export type RecordStatus = 'draft' | 'published'
export type RecordVisibility = 'teacher' | 'staff' | 'parent'

// Attendance Data
export interface AttendanceData {
  subType: AttendanceSubType
  status: 'present' | 'absent' | 'late' | 'excused'
  time?: string
  reason?: string
  notifyParent: boolean
  followUpRequired: boolean
}

// Performance Data
export interface PerformanceData {
  subType: PerformanceSubType
  subject?: string
  assessmentType?: 'quiz' | 'test' | 'exam' | 'project'
  score?: number
  maxScore?: number
  grade?: string
  area?: string
  rating?: number
  observation?: string
  strengths?: string[]
  improvements?: string[]
}

// Profile Data
export interface ProfileData {
  subType: ProfileSubType
  category?: string
  severity?: 'low' | 'medium' | 'high'
  observation: string
  actionRequired: boolean
  actionTaken?: string
  relatedContacts?: string[]
  attachments?: string[]
}

// Case Related Data
export interface CaseRelatedData {
  caseId: string
  caseType: 'discipline' | 'sen' | 'counselling' | 'career-guidance'
  sessionType: 'intervention' | 'check-in' | 'progress-review' | 'parent-meeting'
  attendees: string[]
  discussion: string
  interventions?: string[]
  progress?: 'improving' | 'stable' | 'declining'
  nextSteps?: string[]
}

// Base Student Record
export interface StudentRecord {
  id: string
  studentId: string
  type: RecordType
  subType: string
  date: string
  title: string
  description: string
  createdBy: string
  createdAt: string
  status: RecordStatus
  visibility: RecordVisibility
  tags?: string[]
  data: AttendanceData | PerformanceData | ProfileData | CaseRelatedData
}

// Report Slip Types
export type ReportSlipStatus = 'draft' | 'submitted' | 'approved'
export type Term = 'Term 1' | 'Term 2' | 'Term 3' | 'Term 4'

export interface SubjectGrade {
  subject: string
  grade: string
  score?: number
  subjectTeacher: string
  remarks?: string
}

export interface AttendanceSummary {
  percentage: number
  daysPresent: number
  daysAbsent: number
  daysLate: number
}

export interface ReportSlip {
  id: string
  studentId: string
  studentName: string
  class: string
  term: Term
  academicYear: string
  status: ReportSlipStatus
  lastUpdated: string

  subjects: SubjectGrade[]
  overallGrade?: string
  classPosition?: number

  conduct: string
  attendance: AttendanceSummary

  teacherRemarks: string
  cceGrade?: string
  cceRemarks?: string

  formTeacher: string
  dateApproved?: string
  principalApproval?: string

  parentViewed?: boolean
  parentViewedDate?: string
  parentSignature?: string
}
