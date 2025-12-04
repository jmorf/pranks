import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'
import { initAuth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE - Delete a comment
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

    const payloadUser = payloadUsers.docs[0]

    // Get the comment to verify ownership
    const comment = await payload.findByID({
      collection: 'comments',
      id: Number(id),
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if user is the author or an admin
    const authorId = typeof comment.author === 'object' ? comment.author.id : comment.author
    if (authorId !== payloadUser.id && payloadUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the comment
    await payload.delete({
      collection: 'comments',
      id: Number(id),
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
