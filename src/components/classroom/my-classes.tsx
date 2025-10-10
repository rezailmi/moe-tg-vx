'use client'

import { HomeIcon, UsersIcon, TrophyIcon, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/contexts/user-context'
import { useClasses } from '@/hooks/use-classes'
import { cn } from '@/lib/utils'
import type { Class, CCAClass, AINotification, OverallStatus } from '@/types/classroom'

interface MyClassesProps {
  onClassClick?: (classId: string, className: string) => void
}

export function MyClasses({ onClassClick }: MyClassesProps) {
  const { user, loading: userLoading } = useUser()
  const { formClass, subjectClasses, ccaClasses, loading: classesLoading } = useClasses(user?.user_id || '')

  const hasFormClass = user?.role === 'FormTeacher' && formClass
  const loading = userLoading || classesLoading

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>

        {/* Form Class Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ClassCardSkeleton isFormClass={true} />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[380px] w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Subject Classes Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading user data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">My Classroom</h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your classes, students, and teaching activities
          </p>
        </div>
      </div>

      {/* Form Class (if applicable) */}
      {hasFormClass && formClass && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">Form class</h2>
          </div>

          {/* Two-column layout: Main card (left) + Overall card (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ClassCard
                classData={formClass}
                isFormClass={true}
                onClassClick={onClassClick}
              />
            </div>
            <div className="lg:col-span-1">
              <OverallCard status={formClass.overall_status} />
            </div>
          </div>
        </div>
      )}

      {/* Subject Classes */}
      {subjectClasses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">
              Subject class {subjectClasses.length}
            </h2>
          </div>

          {/* Three-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectClasses.map((classData) => (
              <ClassCard
                key={classData.class_id}
                classData={classData}
                isFormClass={false}
                onClassClick={onClassClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* CCA Classes */}
      {ccaClasses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">
              CCA class {ccaClasses.length}
            </h2>
          </div>

          {/* Full-width cards */}
          <div className="space-y-4">
            {ccaClasses.map((ccaClass) => (
              <CCACard
                key={ccaClass.cca_id}
                ccaData={ccaClass}
                onClassClick={onClassClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

interface ClassCardProps {
  classData: Class
  isFormClass: boolean
  onClassClick?: (classId: string, className: string) => void
}

function ClassCard({ classData, isFormClass, onClassClick }: ClassCardProps) {
  // Format schedule for display
  const formatSchedule = (schedule: typeof classData.schedule): string => {
    if (!schedule || schedule.length === 0) {
      return 'Not scheduled'
    }
    const days = schedule.map(s => s.day).join(', ')
    return days
  }

  return (
    <Card
      className={cn(
        "border-stone-200 hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col",
        "hover:border-stone-300"
      )}
      onClick={() => onClassClick?.(classData.class_id, classData.class_name)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-stone-900 mb-3">
          Class {classData.class_name}
        </CardTitle>
        {/* Inline badges */}
        <div className="flex flex-wrap gap-2">
          {isFormClass && (
            <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200">
              Form class
            </Badge>
          )}
          {!isFormClass && (
            <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200">
              {classData.subject}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200">
            Year {classData.year_level}
          </Badge>
          {classData.awards && classData.awards.length > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              {classData.awards[0]}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4">
        {/* Horizontal stats bar with dividers - no background */}
        <div className="flex items-stretch divide-x divide-stone-200">
          <StatItem label="Student" value={classData.student_count} />
          <StatItem 
            label="Classroom" 
            value={classData.classroom_number || (
              <span className="text-xs text-stone-400 italic">TODO: DB</span>
            )} 
          />
          {isFormClass ? (
            <>
              <StatItem label="SEN" value={classData.sen_count || 0} />
              <StatItem label="P&A" value={classData.pa_count || 0} />
            </>
          ) : (
            <StatItem 
              label="My classes" 
              value={formatSchedule(classData.schedule)}
            />
          )}
        </div>

        {/* AI Agent notification box */}
        <div className="mt-auto pt-6">
          <AINotificationBox notification={classData.ai_notification} />
        </div>
      </CardContent>
    </Card>
  )
}

interface CCACardProps {
  ccaData: CCAClass
  onClassClick?: (classId: string, className: string) => void
}

function CCACard({ ccaData, onClassClick }: CCACardProps) {
  // Format schedule for display
  const formatSchedule = (schedule: typeof ccaData.schedule): string => {
    if (!schedule || schedule.length === 0) {
      return 'Not scheduled'
    }
    const days = schedule.map(s => s.day).join(', ')
    return days
  }

  return (
    <Card
      className={cn(
        "border-stone-200 hover:shadow-md transition-shadow cursor-pointer group",
        "hover:border-stone-300"
      )}
      onClick={() => onClassClick?.(ccaData.cca_id, ccaData.name)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-stone-900 mb-3">
          Class {ccaData.name}
        </CardTitle>
        {/* Inline badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200">
            {ccaData.type}
          </Badge>
          <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200">
            Year {ccaData.type === 'Sports' ? '6' : '5'}
          </Badge>
          {ccaData.type === 'Sports' && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              Excellence award winner
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Horizontal stats bar with dividers - no background */}
        <div className="flex items-stretch divide-x divide-stone-200">
          <StatItem label="Student" value={ccaData.members.length} />
          <StatItem 
            label="Location" 
            value={ccaData.location || (
              <span className="text-xs text-stone-400 italic">TODO: DB</span>
            )} 
          />
          <StatItem 
            label="My classes" 
            value={formatSchedule(ccaData.schedule)}
          />
        </div>

        {/* AI Agent notification box */}
        <AINotificationBox notification={ccaData.ai_notification} />
      </CardContent>
    </Card>
  )
}

// Overall status card for form class
interface OverallCardProps {
  status?: OverallStatus
}

function OverallCard({ status }: OverallCardProps) {
  const defaultMessage = "All good, Mr. Tan"
  const statusMessage = status?.message || defaultMessage

  return (
    <Card className="border-stone-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Overall</p>
        <CardTitle className="text-lg font-semibold text-stone-900 mt-2">
          {statusMessage}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {status?.illustration_url ? (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={status.illustration_url} 
              alt="Overall status illustration" 
              className="w-full h-auto"
            />
          </div>
        ) : (
          // Placeholder with gradient background (matching Figma design)
          <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-b from-blue-200 via-blue-100 to-pink-100">
            {/* Cloud-like decorative element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-xs text-stone-500 italic">
                  {/* TODO: Add illustration asset */}
                  Illustration pending
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// AI Agent notification box
interface AINotificationBoxProps {
  notification?: AINotification
}

function AINotificationBox({ notification }: AINotificationBoxProps) {
  if (!notification) {
    return (
      <div className="p-4 bg-stone-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900">AI Agent</p>
            <p className="text-sm text-stone-600 mt-1">
              {/* TODO: Integrate with AI Agent API */}
              Pending: AI Agent integration
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "p-4 rounded-lg",
      notification.priority === 'urgent' && "bg-red-50",
      notification.priority === 'warning' && "bg-amber-50",
      (!notification.priority || notification.priority === 'info') && "bg-stone-50"
    )}>
      <div className="flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-900">AI Agent</p>
          <p className="text-sm text-stone-700 mt-1 leading-relaxed">
            {notification.message}
          </p>
          {notification.timestamp && (
            <p className="text-xs text-stone-500 mt-2">
              {new Date(notification.timestamp).toLocaleString('en-SG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Stat item for horizontal stats display
interface StatItemProps {
  label: string
  value: string | number | React.ReactNode
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex-1 px-5 py-6 min-w-0 first:pl-5 last:pr-5">
      <p className="text-xs text-stone-500 mb-2">
        {label}
      </p>
      <p className="text-base font-medium text-stone-900 truncate">
        {value}
      </p>
    </div>
  )
}

// ============================================================================
// Skeleton Components
// ============================================================================

function ClassCardSkeleton({ isFormClass = false }: { isFormClass?: boolean }) {
  return (
    <Card className="border-stone-200 h-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-8 w-24 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          {isFormClass && <Skeleton className="h-5 w-32" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="flex items-stretch divide-x divide-stone-200">
          <div className="flex-1 px-5 py-6">
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex-1 px-5 py-6">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex-1 px-5 py-6">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="p-4 bg-stone-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
