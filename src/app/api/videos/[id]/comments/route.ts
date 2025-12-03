import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get comments for a video
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const comments = await payload.find({
      collection: 'comments',
      where: {
        video: { equals: id },
        status: { equals: 'approved' },
      },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
    })

    return NextResponse.json(comments.docs)
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 })
  }
}

// POST - Create a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { content?: string }
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 })
    }

    // Create comment
    const comment = await payload.create({
      collection: 'comments',
      data: {
        content: content.trim(),
        video: Number(id),
        author: user.id,
        status: 'approved', // Auto-approve for now
      },
      depth: 1,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
