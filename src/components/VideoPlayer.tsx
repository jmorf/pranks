'use client'

import { useEffect } from 'react'
import { Video } from '@/payload-types'

interface VideoPlayerProps {
  video: Video
}

// Extract video ID from TikTok embed URL
function extractTikTokVideoId(embedUrl: string): string | null {
  const match = embedUrl.match(/\/embed\/v2\/(\d+)/) || embedUrl.match(/\/video\/(\d+)/)
  return match ? match[1] : null
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  // Load TikTok SDK for TikTok videos
  useEffect(() => {
    if (video.platform === 'tiktok') {
      // Check if script already exists
      if (!document.getElementById('tiktok-sdk')) {
        const script = document.createElement('script')
        script.id = 'tiktok-sdk'
        script.src = 'https://www.tiktok.com/embed.js'
        script.async = true
        document.body.appendChild(script)
      } else {
        // If script exists, re-render embeds
        // @ts-expect-error TikTok SDK global
        if (window.tiktokEmbed) {
          // @ts-expect-error TikTok SDK global
          window.tiktokEmbed.lib.render()
        }
      }
    }
  }, [video.platform, video.embedUrl])

  // TikTok uses blockquote embed per official docs
  if (video.platform === 'tiktok') {
    const videoId = extractTikTokVideoId(video.embedUrl)
    
    return (
      <div className="flex justify-center">
        <blockquote
          className="tiktok-embed"
          cite={video.sourceUrl}
          data-video-id={videoId}
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              title={video.originalAuthor}
              href={video.originalAuthorUrl || `https://www.tiktok.com/@${video.originalAuthor.replace('@', '')}`}
            >
              {video.originalAuthor}
            </a>
            <p>{video.title}</p>
          </section>
        </blockquote>
      </div>
    )
  }

  // YouTube uses standard iframe embed
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={video.embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={video.title}
      />
    </div>
  )
}
