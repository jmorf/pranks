'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Video } from '@/payload-types'

interface VideoCardProps {
  video: Video
  showTags?: boolean
}

export function VideoCard({ video, showTags = false }: VideoCardProps) {
  // Use slug if available, fallback to ID
  const videoUrl = video.slug ? `/video/${video.slug}` : `/video/${video.id}`
  const platformUrl = `/${video.platform}`
  
  // Use displayTitle if available, fallback to title
  const displayTitle = video.displayTitle || video.title
  
  // Get tags (limited to first 3 for display)
  const tags = (video.tags as string[] | null) || []
  const displayTags = tags.slice(0, 3)
  
  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-muted">
      <Link
        href={videoUrl}
        className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {/* Thumbnail */}
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <h3 className="text-white font-black text-sm md:text-base lg:text-lg text-center uppercase leading-tight drop-shadow-lg">
            {displayTitle}
          </h3>
        </div>
      </Link>

      {/* Platform badge - separate link */}
      <Link
        href={platformUrl}
        className={`
          absolute top-2 right-2 z-10
          text-[10px] font-bold px-2 py-1 uppercase tracking-wide
          transition-opacity hover:opacity-80
          ${video.platform === 'youtube' ? 'bg-red-600 text-white' : 'bg-black text-white'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {video.platform}
      </Link>

      {/* Tag chips for TikTok videos */}
      {showTags && video.platform === 'tiktok' && displayTags.length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-wrap gap-1">
          {displayTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="text-[9px] font-bold px-1.5 py-0.5 bg-white/90 text-black rounded hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
