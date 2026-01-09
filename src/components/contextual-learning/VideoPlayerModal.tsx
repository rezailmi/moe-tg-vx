'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PlayCircle } from 'lucide-react'
import type { LearningContent } from '@/lib/mock-learning-content'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  content: LearningContent | null
}

export function VideoPlayerModal({ isOpen, onClose, content }: VideoPlayerModalProps) {
  if (!content) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            {content.author} • {content.authorRole}
          </DialogDescription>
        </DialogHeader>

        {/* Video placeholder */}
        <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
          {/* Thumbnail placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="text-center space-y-4">
              <PlayCircle className="size-20 text-blue-600 mx-auto" />
              <div className="text-sm text-stone-600 font-medium">
                Video Player Placeholder
              </div>
              <div className="text-xs text-stone-500">
                Duration: {content.duration}
              </div>
            </div>
          </div>

          {/* Fake progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-300">
            <div className="h-full w-1/3 bg-blue-600" />
          </div>
        </div>

        {/* Video info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">About this video</h4>
          <p className="text-sm text-stone-600">{content.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
