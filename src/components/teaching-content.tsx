'use client'

import { useState } from 'react'
import { CheckSquare, ClipboardList, BookOpen, Plus, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TeachingContent() {
  const [activeTab, setActiveTab] = useState('marking')

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Teaching</h1>
              <p className="text-sm text-muted-foreground">
                Manage your teaching tasks and resources
              </p>
            </div>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Quick action
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="marking">
                <CheckSquare className="mr-2 size-4" />
                Marking
              </TabsTrigger>
              <TabsTrigger value="lesson-planning">
                <ClipboardList className="mr-2 size-4" />
                Lesson Planning
              </TabsTrigger>
              <TabsTrigger value="homework">
                <BookOpen className="mr-2 size-4" />
                Homework
              </TabsTrigger>
            </TabsList>

            {/* Marking Tab */}
            <TabsContent value="marking" className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <CheckSquare className="size-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">Marking feature coming soon</h2>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Grade assignments, provide feedback, and track student progress all in one place.
                </p>
                <Badge variant="secondary" className="text-xs">
                  In development
                </Badge>
              </div>

              {/* Sample features */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Grade assignments</CardTitle>
                    <CardDescription className="text-xs">
                      Mark and provide feedback on student work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rubric builder</CardTitle>
                    <CardDescription className="text-xs">
                      Create custom grading rubrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progress tracking</CardTitle>
                    <CardDescription className="text-xs">
                      Monitor student performance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lesson Planning Tab */}
            <TabsContent value="lesson-planning" className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <ClipboardList className="size-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">Lesson Planning feature coming soon</h2>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Create, organize, and share lesson plans with templates and resources.
                </p>
                <Badge variant="secondary" className="text-xs">
                  In development
                </Badge>
              </div>

              {/* Sample features */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lesson templates</CardTitle>
                    <CardDescription className="text-xs">
                      Use pre-built templates for quick planning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resource library</CardTitle>
                    <CardDescription className="text-xs">
                      Attach materials and resources to lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Curriculum mapping</CardTitle>
                    <CardDescription className="text-xs">
                      Align lessons with curriculum standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Homework Tab */}
            <TabsContent value="homework" className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <BookOpen className="size-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">Homework feature coming soon</h2>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Assign, track, and manage homework assignments for your classes.
                </p>
                <Badge variant="secondary" className="text-xs">
                  In development
                </Badge>
              </div>

              {/* Sample features */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Create assignments</CardTitle>
                    <CardDescription className="text-xs">
                      Set homework with due dates and instructions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Submission tracking</CardTitle>
                    <CardDescription className="text-xs">
                      Monitor who has submitted their work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Reminders</CardTitle>
                    <CardDescription className="text-xs">
                      Auto-send reminders for upcoming deadlines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
