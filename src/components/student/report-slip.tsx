'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle2,
  Clock,
  FileEdit,
  Send,
  Download,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportSlip as ReportSlipType } from '@/types/student-records'

interface ReportSlipProps {
  studentId: string
  studentName: string
  class: string
}

// Mock data - in real app, fetch based on studentId
const getMockReportSlip = (studentName: string, className: string): ReportSlipType => ({
  id: 'rs-2025-t1-001',
  studentId: 'student-001',
  studentName,
  class: className,
  term: 'Term 1',
  academicYear: '2025',
  status: 'draft',
  lastUpdated: '2025-09-28',

  subjects: [
    { subject: 'English', grade: 'A', score: 92, subjectTeacher: 'Ms. Lee' },
    { subject: 'Mathematics', grade: 'B', score: 78, subjectTeacher: 'Mr. Tan' },
    { subject: 'Science', grade: 'B+', score: 82, subjectTeacher: 'Mrs. Wong' },
    { subject: 'Mother Tongue', grade: 'A', score: 88, subjectTeacher: 'Mr. Kumar' },
    { subject: 'Humanities', grade: 'B', score: 75, subjectTeacher: 'Ms. Lim' },
  ],

  overallGrade: 'B+',
  classPosition: 8,

  conduct: 'Good',
  attendance: {
    percentage: 98,
    daysPresent: 48,
    daysAbsent: 1,
    daysLate: 0,
  },

  teacherRemarks: `${studentName} has shown excellent improvement this term, particularly in English where she achieved an A grade. She demonstrates resilience, a growth mindset, and is always willing to help her peers. Her diligence and positive attitude are commendable. Continue to encourage her reading comprehension skills.`,

  cceGrade: 'Good',
  cceRemarks:
    'Demonstrates strong character values and actively participates in class discussions.',

  formTeacher: 'Mr. Daniel Tan',
})

export function ReportSlip({ studentId, studentName, class: className }: ReportSlipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [reportSlip] = useState<ReportSlipType>(() =>
    getMockReportSlip(studentName, className)
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        )
      case 'submitted':
        return (
          <Badge
            variant="outline"
            className="gap-1 border-blue-300 bg-blue-50 text-blue-700"
          >
            <Send className="h-3 w-3" />
            Submitted
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with status and actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{reportSlip.term} Report Slip</h2>
            {getStatusBadge(reportSlip.status)}
          </div>
          <p className="text-sm text-stone-600">
            Academic Year {reportSlip.academicYear} • Last updated{' '}
            {new Date(reportSlip.lastUpdated).toLocaleDateString('en-SG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex gap-2">
          {reportSlip.status === 'draft' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FileEdit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
              <Button size="sm">
                <Send className="mr-2 h-4 w-4" />
                Submit for Approval
              </Button>
            </>
          )}

          {reportSlip.status === 'approved' && (
            <>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Student Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="mb-1 text-stone-500">Name</p>
              <p className="font-medium">{studentName}</p>
            </div>
            <div>
              <p className="mb-1 text-stone-500">Class</p>
              <p className="font-medium">{className}</p>
            </div>
            <div>
              <p className="mb-1 text-stone-500">Form Teacher</p>
              <p className="font-medium">{reportSlip.formTeacher}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Subject Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportSlip.subjects.map((subject) => (
                <TableRow key={subject.subject}>
                  <TableCell className="font-medium">{subject.subject}</TableCell>
                  <TableCell>{subject.score}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subject.grade.startsWith('A') ? 'default' : 'secondary'
                      }
                    >
                      {subject.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-stone-600">
                    {subject.subjectTeacher}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1 text-stone-500">Overall Grade</p>
              <p className="text-lg font-semibold">{reportSlip.overallGrade}</p>
            </div>
            <div>
              <p className="mb-1 text-stone-500">Class Position</p>
              <p className="text-lg font-semibold">#{reportSlip.classPosition}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conduct & Attendance */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conduct</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={reportSlip.conduct === 'Excellent' ? 'default' : 'secondary'}
              className="px-3 py-1 text-base"
            >
              {reportSlip.conduct}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Attendance Rate</span>
                <span className="font-semibold">
                  {reportSlip.attendance.percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Days Present</span>
                <span className="font-medium">
                  {reportSlip.attendance.daysPresent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Days Absent</span>
                <span className="font-medium">{reportSlip.attendance.daysAbsent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Days Late</span>
                <span className="font-medium">{reportSlip.attendance.daysLate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CCE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Character & Citizenship Education (CCE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <p className="mb-1 text-sm text-stone-500">CCE Grade</p>
            <Badge variant="secondary">{reportSlip.cceGrade}</Badge>
          </div>
          <div>
            <p className="mb-2 text-sm text-stone-500">Remarks</p>
            <p className="text-sm">{reportSlip.cceRemarks}</p>
          </div>
        </CardContent>
      </Card>

      {/* Teacher's Remarks (HDP Comments) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Form Teacher&apos;s Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              defaultValue={reportSlip.teacherRemarks}
              rows={6}
              className="text-sm"
              placeholder="Enter your holistic development profile comments..."
            />
          ) : (
            <p className="text-sm leading-relaxed">{reportSlip.teacherRemarks}</p>
          )}
        </CardContent>
      </Card>

      {/* Approval Info */}
      {reportSlip.status === 'approved' && reportSlip.dateApproved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <span>
                Approved on{' '}
                {new Date(reportSlip.dateApproved).toLocaleDateString('en-SG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit reminder */}
      {reportSlip.status === 'draft' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800">
              <strong>Reminder:</strong> Report slips in submitted state require Key
              Personnel approval before being finalized.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
