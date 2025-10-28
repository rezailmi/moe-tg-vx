'use client'

import { FileText, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function FormsContent() {
  return (
    <div className="flex h-full flex-col">
      {/* Header with search */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
              <p className="text-sm text-muted-foreground">
                Access and submit school forms
              </p>
            </div>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              New submission
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-6 py-6">
          {/* Placeholder content */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Forms feature coming soon</h2>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              Access and submit various school forms including leave applications, permission slips, and more.
            </p>
            <Badge variant="secondary" className="text-xs">
              In development
            </Badge>
          </div>

          {/* Sample form categories */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leave applications</CardTitle>
                <CardDescription className="text-xs">
                  Submit leave requests and view status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">Coming soon</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Permission slips</CardTitle>
                <CardDescription className="text-xs">
                  Field trip and activity permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">Coming soon</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Student forms</CardTitle>
                <CardDescription className="text-xs">
                  Health forms, emergency contacts, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">Coming soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
