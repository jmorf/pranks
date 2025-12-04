import { NextRequest, NextResponse } from 'next/server'
import { initAuth } from '@/lib/auth'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Check if user has liked the video
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const headers = await getHeaders()
    
    // Get Better Auth session
    const auth = initAuth()
    const session = await auth.api.getSession({ headers })
    
    if (!session?.user) {
      return NextResponse.json({ hasLiked: false })
    }

    // For now, check against Payload likes (will need migration later)
    // This checks if any user with this email has liked
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    // Find Payload user with same email
    const payloadUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: session.user.email },
      },
      limit: 1,
    })

    if (payloadUsers.docs.length === 0) {
      return NextResponse.json({ hasLiked: false })
    }

    const payloadUserId = payloadUsers.docs[0].id

    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: id },
        user: { equals: payloadUserId },
      },
      limit: 1,
    })

    return NextResponse.json({ hasLiked: existingLike.docs.length > 0 })
  } catch (error) {
    console.error('Like status error:', error)
    return NextResponse.json({ hasLiked: false })
  }
}
