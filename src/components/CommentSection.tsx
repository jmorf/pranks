'use client'

import { useState, useTransition, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Comment, User } from '@/payload-types'
import { MessageCircle, Trash2 } from 'lucide-react'

interface CommentSectionProps {
  videoId: string
  initialComments: Comment[]
  isAuthenticated: boolean
  currentUserId?: number
}

export function CommentSection({
  videoId,
  initialComments,
  isAuthenticated,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !isAuthenticated) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newComment }),
        })

        if (response.ok) {
          const comment = await response.json() as Comment
          setComments((prev) => [comment, ...prev])
          setNewComment('')
        }
      } catch (error) {
        console.error('Failed to post comment:', error)
      }
    })
  }

  const handleDelete = async (commentId: number) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setComments((prev) => prev.filter((c) => c.id !== commentId))
        }
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/1000
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isPending}
            >
              {isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/admin" className="text-primary hover:underline font-medium">
              Sign in
            </a>{' '}
            to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => {
            const author = comment.author as User
            const isOwner = currentUserId === author?.id

            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {author?.name?.charAt(0)?.toUpperCase() ||
                    author?.email?.charAt(0)?.toUpperCase() ||
                    '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {author?.name || author?.email?.split('@')[0] || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors ml-auto"
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
