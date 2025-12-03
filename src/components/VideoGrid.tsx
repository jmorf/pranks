'use client'

import { VideoCard } from '@/components/VideoCard'
import { Video } from '@/payload-types'

interface VideoGridProps {
  videos: Video[]
  showTags?: boolean
}

export function VideoGrid({ videos, showTags = true }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No videos found.</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showTags={showTags}
        />
      ))}
    </div>
  )
}
