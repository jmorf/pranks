'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Video } from '@/payload-types'
import { ExternalLink } from 'lucide-react'

interface VideoModalProps {
  video: Video | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoModal({ video, open, onOpenChange }: VideoModalProps) {
  if (!video) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg font-bold line-clamp-1">
            {video.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <span>by {video.originalAuthor}</span>
            {video.originalAuthorUrl && (
              <a
                href={video.originalAuthorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View channel
              </a>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Video embed */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={video.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Description */}
        {video.description && (
          <div className="p-4 pt-2 max-h-32 overflow-y-auto">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
