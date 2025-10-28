'use client'

import {
  Search,
  Users,
  Utensils,
  BarChart3,
  BookCheck,
  Heart,
  Award,
  Target,
  TrendingUp,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardCheck,
  UserCheck,
  type LucideIcon
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Template {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

interface TemplateCategory {
  name: string
  templates: Template[]
}

const templateCategories: TemplateCategory[] = [
  {
    name: 'Student Development',
    templates: [
      {
        id: 'cca-selection',
        title: 'CCA Selection Form',
        description: 'With allocation template to facilitate CCA allocation exercise',
        icon: Users,
      },
      {
        id: 'dietary-requirements',
        title: 'Dietary Requirements',
        description: 'Gather dietary requirements from students or colleagues in the school',
        icon: Utensils,
      },
      {
        id: 'item-analysis',
        title: 'Item Analysis',
        description: 'Consolidate student responses to individual assessment questions to identify learning gaps',
        icon: BarChart3,
      },
      {
        id: 'marks-verification',
        title: 'Marks Verification and Reflection',
        description: 'Get your students to verify their marks and reflect on ways to improve',
        icon: BookCheck,
      },
      {
        id: 'mood-reflection',
        title: 'Mood Reflection Template',
        description: 'This is for CotF Schools to promote emotional literacy. Contact cotf@moe.edu.sg to use. Do not alter for data...',
        icon: Heart,
      },
      {
        id: 'nomination-form',
        title: 'Nomination Form',
        description: 'Gather nominations for leadership roles or award recipients',
        icon: Award,
      },
      {
        id: 'target-setting-primary',
        title: 'Target Setting (Primary)',
        description: 'Encourage students to set their desired grade for each subject or for overall academic performance',
        icon: Target,
      },
      {
        id: 'target-setting-secondary',
        title: 'Target Setting (Secondary)',
        description: 'Encourage students to set their desired grade for each subject or for overall academic performance',
        icon: TrendingUp,
      },
      {
        id: 'target-setting-n',
        title: "Target Setting for N' Levels",
        description: 'Encourage students to set their desired grade for each subject or for overall academic performance.',
        icon: GraduationCap,
      },
      {
        id: 'target-setting-o',
        title: "Target Setting for O' Levels",
        description: 'Encourage students to set their desired grade for each subject or for overall academic performance.',
        icon: BookOpen,
      },
    ],
  },
  {
    name: 'Parents Consent Form',
    templates: [
      {
        id: 'field-trip-consent',
        title: 'Field Trip Consent Form',
        description: 'Gather parental consent for field trips and excursions',
        icon: FileText,
      },
      {
        id: 'activity-consent',
        title: 'Activity Consent Form',
        description: 'Permission form for school activities and events',
        icon: ClipboardCheck,
      },
      {
        id: 'medical-consent',
        title: 'Medical Consent Form',
        description: 'Parental consent for medical treatment and emergency care',
        icon: UserCheck,
      },
    ],
  },
  {
    name: 'Termly Checkin',
    templates: [
      {
        id: 'term-1-checkin',
        title: 'Term 1 Check-in',
        description: 'Review student progress and wellbeing for Term 1',
        icon: ClipboardCheck,
      },
      {
        id: 'term-2-checkin',
        title: 'Term 2 Check-in',
        description: 'Review student progress and wellbeing for Term 2',
        icon: ClipboardCheck,
      },
      {
        id: 'term-3-checkin',
        title: 'Term 3 Check-in',
        description: 'Review student progress and wellbeing for Term 3',
        icon: ClipboardCheck,
      },
      {
        id: 'term-4-checkin',
        title: 'Term 4 Check-in',
        description: 'Review student progress and wellbeing for Term 4',
        icon: ClipboardCheck,
      },
    ],
  },
]

export function FormsContent() {
  return (
    <div className="flex h-full flex-col">
      {/* Header with search */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Template Library</h1>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by template name"
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="mx-auto w-full max-w-5xl px-6 py-6">
          <div className="space-y-8">
            {templateCategories.map((category) => (
              <div key={category.name}>
                <h2 className="mb-4 text-lg font-semibold">{category.name}</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.templates.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card key={template.id} className="group transition-shadow hover:shadow-md">
                        <CardHeader className="space-y-3 p-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-muted p-2">
                              <Icon className="size-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-sm font-semibold leading-tight">
                              {template.title}
                            </CardTitle>
                            <CardDescription className="text-xs leading-relaxed">
                              {template.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
