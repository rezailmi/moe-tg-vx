'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LearningMomentCard } from '@/components/contextual-learning/LearningMomentCard'
import { LearningResourcesPanel } from '@/components/contextual-learning/LearningResourcesPanel'
import { getContentForContext } from '@/lib/mock-learning-content'
import { AlertTriangle, TrendingDown, User } from 'lucide-react'

type ContextType = 'student-at-risk' | 'declining-attendance' | 'academic-decline' | null

export default function LearningDemoPage() {
  const [selectedContext, setSelectedContext] = useState<ContextType>('student-at-risk')
  const [showLearningMoment, setShowLearningMoment] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Get content for selected context
  const { context, content } = selectedContext
    ? getContentForContext(selectedContext)
    : { context: undefined, content: [] }

  // Reset state when context changes
  useEffect(() => {
    setIsDismissed(false)
    setIsExpanded(false)
    setShowLearningMoment(true)

    // Clear localStorage for demo purposes
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learning-moment-dismissed')
    }
  }, [selectedContext])

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setShowLearningMoment(false)
  }

  const handleContextChange = (ctx: ContextType) => {
    setSelectedContext(ctx)
  }

  const handleReset = () => {
    setIsDismissed(false)
    setIsExpanded(false)
    setShowLearningMoment(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learning-moment-dismissed')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-stone-900">
            Teachers Gateway - Contextual Learning POC
          </h1>
          <p className="text-stone-600">
            Demonstrating contextual learning moments that surface relevant professional development content
          </p>
        </div>

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>
              Simulate different student contexts to see how learning moments appear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Context Selection */}
            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">
                Simulate Context:
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedContext === 'student-at-risk' ? 'default' : 'outline'}
                  onClick={() => handleContextChange('student-at-risk')}
                  className="gap-2"
                >
                  <AlertTriangle className="size-4" />
                  Student At-Risk
                </Button>
                <Button
                  variant={selectedContext === 'declining-attendance' ? 'default' : 'outline'}
                  onClick={() => handleContextChange('declining-attendance')}
                  className="gap-2"
                >
                  <TrendingDown className="size-4" />
                  Declining Attendance
                </Button>
                <Button
                  variant={selectedContext === 'academic-decline' ? 'default' : 'outline'}
                  onClick={() => handleContextChange('academic-decline')}
                  className="gap-2"
                >
                  <TrendingDown className="size-4" />
                  Academic Decline
                </Button>
              </div>
            </div>

            {/* Toggle Controls */}
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showLearningMoment}
                  onChange={(e) => {
                    setShowLearningMoment(e.target.checked)
                    if (e.target.checked) {
                      setIsDismissed(false)
                    }
                  }}
                  className="size-4 rounded border-stone-300"
                />
                Show Learning Moment Card
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                Reset Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Student Profile (Simplified) */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile (Simplified)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Student Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                        <User className="size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">John Tan Wei Ming</h3>
                          <p className="text-sm text-stone-600">Secondary 3A • Age: 15</p>
                        </div>
                        {selectedContext === 'student-at-risk' && (
                          <Badge variant="destructive" className="gap-1.5">
                            <AlertTriangle className="size-3" />
                            AT RISK
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-stone-600">Academic</div>
                      <div className="text-lg font-semibold text-stone-900">
                        C+ {selectedContext === 'academic-decline' && (
                          <span className="text-sm text-red-600">(↓ from B)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-stone-600">Attendance</div>
                      <div className="text-lg font-semibold text-stone-900">
                        {selectedContext === 'declining-attendance' ? '87%' : '95%'}
                        {selectedContext === 'declining-attendance' && (
                          <span className="text-sm text-orange-600"> (↓)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-stone-600">Wellbeing</div>
                      <div className="text-lg font-semibold">
                        {selectedContext === 'student-at-risk' ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertTriangle className="size-4" />
                            AT RISK
                          </span>
                        ) : (
                          <span className="text-green-600">Good</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-sm text-stone-700">Recent Observations</h4>
                    <ul className="text-sm text-stone-600 space-y-1">
                      {selectedContext === 'student-at-risk' && (
                        <>
                          <li>• Withdrawn in class, minimal participation</li>
                          <li>• Missing assignments in English and Mathematics</li>
                          <li>• Expressed feeling overwhelmed during check-in</li>
                        </>
                      )}
                      {selectedContext === 'declining-attendance' && (
                        <>
                          <li>• Absent 4 days this month without clear reason</li>
                          <li>• Late to class on multiple occasions</li>
                          <li>• Parent communication needed</li>
                        </>
                      )}
                      {selectedContext === 'academic-decline' && (
                        <>
                          <li>• Grades dropping across multiple subjects</li>
                          <li>• Test scores below previous performance</li>
                          <li>• Appears distracted in class</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Moment Sidebar */}
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Learning Moment</CardTitle>
                  <CardDescription className="text-xs">
                    Contextual professional development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showLearningMoment && context && !isDismissed ? (
                    <LearningMomentCard
                      title={context.title}
                      description={context.description}
                      onExpand={handleExpand}
                      onDismiss={handleDismiss}
                      isDismissed={isDismissed}
                      storageKey="learning-moment-dismissed"
                    />
                  ) : (
                    <div className="text-sm text-stone-500 text-center py-8">
                      {isDismissed ? 'Learning moment dismissed' : 'No learning moment for this context'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status indicator */}
              <Card className="bg-stone-100">
                <CardContent className="p-4">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Card Visible:</span>
                      <span className={showLearningMoment && !isDismissed ? 'text-green-600' : 'text-red-600'}>
                        {showLearningMoment && !isDismissed ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Panel Expanded:</span>
                      <span className={isExpanded ? 'text-green-600' : 'text-stone-400'}>
                        {isExpanded ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Resources Available:</span>
                      <span className="text-stone-900">{content.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Expanded Resources Panel */}
        {context && (
          <LearningResourcesPanel
            context={context}
            content={content}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(false)}
          />
        )}
      </div>
    </div>
  )
}
