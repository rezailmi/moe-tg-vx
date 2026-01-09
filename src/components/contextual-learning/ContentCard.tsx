'use client'

import { PlayCircle, FileText, BookOpen, Clock, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LearningContent } from '@/lib/mock-learning-content'

interface ContentCardProps {
  content: LearningContent
  onView: () => void
  onSaveLater: () => void
  isSaved?: boolean
}

export function ContentCard({ content, onView, onSaveLater, isSaved = false }: ContentCardProps) {
  const getTypeIcon = () => {
    switch (content.type) {
      case 'video':
        return <PlayCircle className="size-5 text-blue-600" />
      case 'pdf':
        return <FileText className="size-5 text-red-600" />
      case 'guide':
        return <BookOpen className="size-5 text-green-600" />
    }
  }

  const getTypeBadge = () => {
    const colors = {
      video: 'bg-blue-100 text-blue-800 border-blue-300',
      pdf: 'bg-red-100 text-red-800 border-red-300',
      guide: 'bg-green-100 text-green-800 border-green-300',
    }

    return (
      <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border', colors[content.type])}>
        {getTypeIcon()}
        <span className="uppercase">{content.type}</span>
      </div>
    )
  }

  const getDurationOrPages = () => {
    if (content.duration) {
      return (
        <div className="flex items-center gap-1 text-sm text-stone-600">
          <Clock className="size-4" />
          <span>{content.duration}</span>
        </div>
      )
    }
    if (content.pages) {
      return (
        <div className="flex items-center gap-1 text-sm text-stone-600">
          <FileIcon className="size-4" />
          <span>{content.pages} pages</span>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with type badge and duration */}
          <div className="flex items-start justify-between gap-2">
            {getTypeBadge()}
            {getDurationOrPages()}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-base leading-tight">{content.title}</h4>

          {/* Author */}
          <div className="text-sm text-stone-600">
            <div className="font-medium">{content.author}</div>
            <div className="text-xs text-stone-500">{content.authorRole}</div>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-600 line-clamp-2">{content.description}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={onView} size="sm" className="flex-1">
              {content.type === 'video' ? 'Watch' : 'View'}
            </Button>
            <Button
              onClick={onSaveLater}
              variant="outline"
              size="sm"
              className={cn(
                'flex-1',
                isSaved && 'bg-green-50 text-green-700 border-green-300'
              )}
            >
              {isSaved ? 'Saved ✓' : 'Save for Later'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
