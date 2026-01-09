'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { LearningContent } from '@/lib/mock-learning-content'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  content: LearningContent | null
}

export function PdfViewerModal({ isOpen, onClose, content }: PdfViewerModalProps) {
  if (!content) return null

  const handleDownload = () => {
    toast.success('Download started', {
      description: `Downloading ${content.title}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            {content.author} • {content.authorRole} • {content.pages} pages
          </DialogDescription>
        </DialogHeader>

        {/* PDF placeholder */}
        <div className="flex-1 min-h-[500px] bg-stone-100 rounded-lg overflow-hidden">
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center space-y-4 p-8">
              <FileText className="size-20 text-red-600 mx-auto" />
              <div className="text-sm text-stone-600 font-medium">
                PDF Preview Placeholder
              </div>
              <div className="text-xs text-stone-500 max-w-md">
                {content.description}
              </div>
              <div className="pt-4">
                <Button onClick={handleDownload} variant="outline" className="gap-2">
                  <Download className="size-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page indicator */}
        <div className="text-center text-xs text-stone-500 py-2">
          Page 1 of {content.pages}
        </div>
      </DialogContent>
    </Dialog>
  )
}
