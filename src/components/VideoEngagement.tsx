'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
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
      // Redirect to login
      window.location.href = '/admin'
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

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'gap-2 transition-colors',
        hasLiked && 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          hasLiked && 'fill-primary text-primary'
        )}
      />
      <span className="font-medium">{likesCount}</span>
    </Button>
  )
}
