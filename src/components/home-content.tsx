'use client'

import {
  Edit2Icon,
  SparklesIcon,
  BookOpenIcon,
  MessageSquareIcon,
  CheckCircle2Icon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const actionButtons = [
  { key: 'marking', label: 'Marking', icon: Edit2Icon },
  { key: 'analyse', label: 'Analyse', icon: SparklesIcon },
  { key: 'learn', label: 'Learn', icon: BookOpenIcon },
  { key: 'communicate', label: 'Communicate', icon: MessageSquareIcon },
]

// Mock data for teacher widgets
const classScheduleData = {
  currentPeriod: 3,
  classes: [
    { period: 3, time: '10:30-11:15', subject: 'Math 10A', room: 'Room 204', isNow: true },
    { period: 4, time: '11:15-12:00', subject: 'Math 10B', room: 'Room 204', isNow: false },
    { period: 5, time: '1:00-1:45', subject: 'Math 9A', room: 'Room 201', isNow: false },
  ],
}

const attendanceData = {
  present: 142,
  total: 151,
  percentage: 94,
  absent: 9,
}

const homeworkData = {
  pendingReview: 23,
  dueSoon: 5,
  totalAssigned: 180,
  submitted: 140,
  submissionRate: 78,
}

const studentAlertsData = [
  { id: 1, student: 'Emma Wilson', message: '3 absences this week', priority: 'high' as const },
  { id: 2, student: 'James Chen', message: 'Missing 2 assignments', priority: 'medium' as const },
  { id: 3, student: 'Sofia Garcia', message: 'Excellent progress', priority: 'info' as const },
]

export function HomeContent() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      {/* Assistant Input */}
      <div className="flex flex-col gap-4 pt-4">
        <div className="relative w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <SparklesIcon className="size-5 text-primary" />
          </div>
          <Input
            type="text"
            placeholder="Ask me about students, assignments, or lesson plans..."
            className="h-16 rounded-2xl border-2 pl-14 pr-6 text-base shadow-lg transition-all placeholder:text-muted-foreground/60 hover:shadow-xl focus-visible:border-primary focus-visible:shadow-xl"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Try asking:</span>
          <button className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground">
            &quot;Find student with needs&quot;
          </button>
          <button className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground">
            &quot;Draft a parent email&quot;
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actionButtons.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              className="group flex h-28 flex-col items-center justify-center gap-3 rounded-xl border bg-card transition-colors hover:bg-accent"
            >
              <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Teacher Widgets Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Class Schedule Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classScheduleData.classes.map((classItem) => (
              <div
                key={classItem.period}
                className={`space-y-1 ${classItem.isNow ? 'rounded-lg bg-accent/50 -mx-2 px-2 py-2' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{classItem.subject}</span>
                  <span className="text-xs text-muted-foreground">{classItem.room}</span>
                </div>
                <p className="text-xs text-muted-foreground">{classItem.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Quick View Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`text-5xl font-bold tracking-tight ${
                attendanceData.percentage >= 90
                  ? 'text-green-600 dark:text-green-500'
                  : attendanceData.percentage >= 80
                    ? 'text-yellow-600 dark:text-yellow-500'
                    : 'text-destructive'
              }`}
            >
              {attendanceData.percentage}%
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                {attendanceData.present} of {attendanceData.total} present
              </p>
              <p className="text-xs text-muted-foreground">
                {attendanceData.absent} students absent
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Tracker Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <p className="text-3xl font-bold">{homeworkData.pendingReview}</p>
                <p className="text-xs text-muted-foreground">To review</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{homeworkData.dueSoon}</p>
                <p className="text-xs text-muted-foreground">Due soon</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Submission rate</span>
                <span className="font-medium">{homeworkData.submissionRate}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${homeworkData.submissionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Alerts Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Student Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentAlertsData.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3">
                <div
                  className={`mt-1 size-1.5 shrink-0 rounded-full ${
                    alert.priority === 'high'
                      ? 'bg-destructive'
                      : alert.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium">{alert.student}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                {alert.priority === 'info' && (
                  <CheckCircle2Icon className="size-4 shrink-0 text-green-600 dark:text-green-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245</div>
            <p className="mt-1 text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="mt-1 text-xs text-muted-foreground">Across 3 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32</div>
            <p className="mt-1 text-xs text-muted-foreground">Due by end of week</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Widgets Button */}
      <div className="flex justify-center pt-4">
        <button className="rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          Edit widgets
        </button>
      </div>
    </div>
  )
}

