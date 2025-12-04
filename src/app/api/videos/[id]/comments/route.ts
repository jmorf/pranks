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
        author: payloadUser.id,
        status: 'approved', // Auto-approve for now
      },
      depth: 1,
      overrideAccess: true,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
