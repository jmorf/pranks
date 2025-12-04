import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'
import { initAuth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Helper to get or create Payload user from Better Auth session
async function getOrCreatePayloadUser(payload: any, session: any) {
  if (!session?.user?.email) return null
  
  // Find existing Payload user with same email
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: session.user.email } },
    limit: 1,
  })
  
  if (existing.docs.length > 0) {
    return existing.docs[0]
  }
  
  // Create a new Payload user for this Better Auth user
  const newUser = await payload.create({
    collection: 'users',
    data: {
      email: session.user.email,
      name: session.user.name || session.user.email.split('@')[0],
      password: crypto.randomUUID(), // Random password since auth is handled by Better Auth
    },
    overrideAccess: true,
  })
  
  return newUser
}

// POST - Like a video
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    // Get Better Auth session
    const auth = initAuth()
    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create corresponding Payload user
    const payloadUser = await getOrCreatePayloadUser(payload, session)
    if (!payloadUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Check if already liked
    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: id },
        user: { equals: payloadUser.id },
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
        user: payloadUser.id,
      },
      overrideAccess: true,
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
    
    // Get Better Auth session
    const auth = initAuth()
    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find Payload user with same email
    const payloadUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: session.user.email } },
      limit: 1,
    })

    if (payloadUsers.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const payloadUserId = payloadUsers.docs[0].id

    // Find the like
    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: id },
        user: { equals: payloadUserId },
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
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json({ error: 'Failed to unlike video' }, { status: 500 })
  }
}
