import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    // Get current video
    const video = await payload.findByID({
      collection: 'videos',
      id,
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Increment view count (bypass access control for this operation)
    await payload.update({
      collection: 'videos',
      id,
      data: {
        viewCount: (video.viewCount || 0) + 1,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 })
  }
}
