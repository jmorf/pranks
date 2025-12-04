'use client'

import { useState, useTransition, useEffect } from 'react'
import { AuthModal } from '@/components/AuthModal'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/authClient'

interface VideoEngagementProps {
  videoId: string
  initialLikesCount: number
}

export function VideoEngagement({
  videoId,
  initialLikesCount,
}: VideoEngagementProps) {
  const { data: session, isPending: isSessionPending } = useSession()
  const isAuthenticated = !!session?.user
  
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [hasLiked, setHasLiked] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isLoadingLikeStatus, setIsLoadingLikeStatus] = useState(true)

  // Fetch user's like status when authenticated
  useEffect(() => {
    if (isSessionPending) return
    
    if (isAuthenticated) {
      fetch(`/api/videos/${videoId}/like-status`)
        .then(res => res.json())
        .then((data: { hasLiked?: boolean }) => {
          setHasLiked(data.hasLiked || false)
        })
        .catch(console.error)
        .finally(() => setIsLoadingLikeStatus(false))
    } else {
      setIsLoadingLikeStatus(false)
    }
  }, [videoId, isAuthenticated, isSessionPending])

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

  // Show loading state
  if (isSessionPending || isLoadingLikeStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-3 border-r border-border w-full">
        <Heart className="h-5 w-5 text-muted-foreground animate-pulse" />
        <span className="text-xs text-muted-foreground mt-1">{likesCount} Likes</span>
      </div>
    )
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
