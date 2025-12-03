import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    
    // Check authentication
    const { user } = await payload.auth({ headers })
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a video' },
        { status: 401 }
      )
    }

    const body = await request.json() as {
      sourceUrl?: string
      title?: string
      description?: string
      embedUrl?: string
      platform?: 'youtube' | 'tiktok'
      thumbnailUrl?: string
      originalAuthor?: string
      originalAuthorUrl?: string
    }

    const {
      sourceUrl,
      title,
      description,
      embedUrl,
      platform,
      thumbnailUrl,
      originalAuthor,
      originalAuthorUrl,
    } = body

    // Validate required fields
    if (!sourceUrl || !title || !embedUrl || !platform || !thumbnailUrl || !originalAuthor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the video
    const video = await payload.create({
      collection: 'videos',
      data: {
        sourceUrl,
        title,
        description,
        embedUrl,
        platform,
        thumbnailUrl,
        originalAuthor,
        originalAuthorUrl,
        status: 'pending',
        submittedBy: user.id,
        viewCount: 0,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Video submission error:', error)
    
    // Handle Payload validation errors
    if (error instanceof Error && error.message) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit video. Please try again.' },
      { status: 500 }
    )
  }
}
