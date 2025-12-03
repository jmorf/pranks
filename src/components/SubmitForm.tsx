'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface VideoPreview {
  title: string
  description?: string
  thumbnailUrl: string
  originalAuthor: string
  originalAuthorUrl?: string
  platform: 'youtube' | 'tiktok'
  embedUrl: string
}

export function SubmitForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<VideoPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFetchPreview = async () => {
    if (!url.trim()) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    setError(null)
    setPreview(null)

    try {
      const response = await fetch('/api/videos/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json() as VideoPreview & { error?: string }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video preview')
      }

      setPreview(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video preview')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!preview) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: url.trim(),
          ...preview,
        }),
      })

      const data = await response.json() as { errors?: { message: string }[]; error?: string }

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || data.error || 'Failed to submit video')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit video')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Video Submitted!</h2>
        <p className="text-muted-foreground">
          Your video has been submitted for review. Redirecting...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url">Video URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="url"
            placeholder="Paste YouTube or TikTok URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchPreview()}
            disabled={loading || submitting}
          />
          <Button
            onClick={handleFetchPreview}
            disabled={loading || !url.trim()}
            variant="secondary"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Preview'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Supports YouTube and TikTok video URLs
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="border rounded-lg overflow-hidden">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-muted">
            {preview.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.thumbnailUrl}
                alt={preview.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No thumbnail available
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`
                text-xs font-bold px-2 py-1 rounded uppercase
                ${preview.platform === 'youtube' ? 'bg-red-600 text-white' : 'bg-black text-white'}
              `}>
                {preview.platform}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-lg line-clamp-2">{preview.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>by {preview.originalAuthor}</span>
              {preview.originalAuthorUrl && (
                <a
                  href={preview.originalAuthorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {preview.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {preview.description}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="p-4 pt-0">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full font-bold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'SUBMIT VIDEO'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
