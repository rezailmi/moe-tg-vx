'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ContentCard } from './ContentCard'
import { VideoPlayerModal } from './VideoPlayerModal'
import { PdfViewerModal } from './PdfViewerModal'
import { toast } from 'sonner'
import type { LearningContent, LearningContext } from '@/lib/mock-learning-content'

interface LearningResourcesPanelProps {
  context: LearningContext
  content: LearningContent[]
  isExpanded: boolean
  onToggle: () => void
}

export function LearningResourcesPanel({ context, content, isExpanded, onToggle }: LearningResourcesPanelProps) {
  const [savedContent, setSavedContent] = useState<Set<string>>(new Set())
  const [selectedVideo, setSelectedVideo] = useState<LearningContent | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<LearningContent | null>(null)
  const [showAll, setShowAll] = useState(false)

  const handleView = (item: LearningContent) => {
    if (item.type === 'video') {
      setSelectedVideo(item)
    } else if (item.type === 'pdf') {
      setSelectedPdf(item)
    } else {
      toast.info('Opening guide', {
        description: item.title,
      })
    }
  }

  const handleSaveLater = (id: string) => {
    setSavedContent(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        toast.info('Removed from saved')
      } else {
        newSet.add(id)
        toast.success('Saved for later')
      }
      return newSet
    })
  }

  if (!isExpanded) return null

  const displayedContent = showAll ? content : content.slice(0, 2)
  const hasMore = content.length > 2

  return (
    <>
      <Card className="mt-4 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-lg">{context.title}</CardTitle>
              <CardDescription className="text-stone-600">
                {content.length} resource{content.length !== 1 ? 's' : ''} available
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="shrink-0"
            >
              <ChevronUp className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Resources grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {displayedContent.map(item => (
                <ContentCard
                  key={item.id}
                  content={item}
                  onView={() => handleView(item)}
                  onSaveLater={() => handleSaveLater(item.id)}
                  isSaved={savedContent.has(item.id)}
                />
              ))}
            </div>

            {/* Show more/less button */}
            {hasMore && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="size-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      Show {content.length - 2} More Resource{content.length - 2 !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        content={selectedVideo}
      />
      <PdfViewerModal
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
        content={selectedPdf}
      />
    </>
  )
}
