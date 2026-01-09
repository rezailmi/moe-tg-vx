'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LearningMomentCardProps {
  title: string
  description: string
  onExpand: () => void
  onDismiss: () => void
  isDismissed?: boolean
  storageKey?: string
}

export function LearningMomentCard({
  title,
  description,
  onExpand,
  onDismiss,
  isDismissed = false,
  storageKey = 'learning-moment-dismissed',
}: LearningMomentCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    // Check if dismissed in localStorage
    if (typeof window !== 'undefined' && storageKey) {
      const dismissed = localStorage.getItem(storageKey)
      if (dismissed === 'true') {
        return
      }
    }

    // Animate in after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [storageKey])

  const handleDismiss = () => {
    setIsAnimatingOut(true)

    // Save to localStorage
    if (typeof window !== 'undefined' && storageKey) {
      localStorage.setItem(storageKey, 'true')
    }

    // Wait for animation before calling onDismiss
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  if (isDismissed || (!isVisible && !isAnimatingOut)) {
    return null
  }

  return (
    <Card
      className={cn(
        'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-yellow-50 shadow-sm',
        'transition-all duration-300',
        isVisible && !isAnimatingOut ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        isAnimatingOut && 'opacity-0 -translate-y-2'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            <div className="bg-blue-100 p-2 rounded-full">
              <Lightbulb className="size-5 text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-stone-900">{title}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="shrink-0 size-8 text-stone-500 hover:text-stone-700"
              >
                <X className="size-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>

            <p className="text-sm text-stone-600">{description}</p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={onExpand}
                size="sm"
                className="gap-2"
              >
                View Resources
                <ChevronRight className="size-4" />
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
