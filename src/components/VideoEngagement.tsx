'use client'

import { useState, useTransition } from 'react'
import { AuthModal } from '@/components/AuthModal'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoEngagementProps {
  videoId: string
  likesCount: number
  userHasLiked: boolean
  isAuthenticated: boolean
}

export function VideoEngagement({
  videoId,
  likesCount: initialLikesCount,
  userHasLiked: initialUserHasLiked,
  isAuthenticated,
}: VideoEngagementProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [hasLiked, setHasLiked] = useState(initialUserHasLiked)
  const [isPending, startTransition] = useTransition()

  const handleLike = async () => {
    if (!isAuthenticated) {
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}/like`, {
          method: hasLiked ? 'DELETE' : 'POST',
        })

        if (response.ok) {
          setHasLiked(!hasLiked)
          setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1))
        }
      } catch (error) {
        console.error('Failed to toggle like:', error)
      }
    })
  }

  if (!isAuthenticated) {
    return (
      <AuthModal
        trigger={
          <button className="flex flex-col items-center justify-center py-3 border-r border-border hover:bg-muted/50 transition-colors w-full">
            <Heart className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">{likesCount} Likes</span>
          </button>
        }
      />
    )
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'flex flex-col items-center justify-center py-3 border-r border-border hover:bg-muted/50 transition-colors w-full',
        hasLiked && 'bg-primary/5'
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all',
          hasLiked ? 'fill-primary text-primary' : 'text-muted-foreground'
        )}
      />
      <span className={cn(
        'text-xs mt-1',
        hasLiked ? 'text-primary font-medium' : 'text-muted-foreground'
      )}>{likesCount} Likes</span>
    </button>
  )
}
