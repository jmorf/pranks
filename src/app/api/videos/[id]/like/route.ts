import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST - Like a video
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

    // Check if already liked
    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: id },
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (existingLike.docs.length > 0) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 })
    }

    // Create like
    const like = await payload.create({
      collection: 'likes',
      data: {
        video: Number(id),
        user: user.id,
      },
    })

    return NextResponse.json(like)
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to like video' }, { status: 500 })
  }
}

// DELETE - Unlike a video
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the like
    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: id },
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (existingLike.docs.length === 0) {
      return NextResponse.json({ error: 'Not liked' }, { status: 400 })
    }

    // Delete the like
    await payload.delete({
      collection: 'likes',
      id: existingLike.docs[0].id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json({ error: 'Failed to unlike video' }, { status: 500 })
  }
}
