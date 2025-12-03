import type { CollectionConfig } from 'payload'

// URL pattern to detect links
const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi

// Common spam patterns
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|poker|lottery|bitcoin|crypto|nft|forex|trading)\b/i,
  /\b(click here|check this|visit my|follow me|subscribe)\b/i,
  /\b(make money|earn money|get rich|free money|easy cash)\b/i,
  /\b(weight loss|diet pills|lose weight fast)\b/i,
]

// NSFW/profanity patterns (basic list - can be expanded)
const NSFW_PATTERNS = [
  /\b(fuck|shit|ass|bitch|cunt|dick|cock|pussy|nigger|faggot|retard)\b/i,
  /\b(porn|xxx|nude|naked|sex|sexy|horny|slut|whore)\b/i,
]

// Excessive caps detection (more than 50% caps in words longer than 3 chars)
function hasExcessiveCaps(text: string): boolean {
  const words = text.split(/\s+/).filter(w => w.length > 3)
  if (words.length === 0) return false
  const capsWords = words.filter(w => w === w.toUpperCase())
  return capsWords.length / words.length > 0.5
}

// Repetitive character detection (e.g., "heeeellllooo")
function hasRepetitiveChars(text: string): boolean {
  return /(.)\1{4,}/i.test(text)
}

// Validate comment content
function validateComment(content: string): { valid: boolean; error?: string } {
  // Trim and check length
  const trimmed = content.trim()
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Comment is too short' }
  }
  
  if (trimmed.length > 1000) {
    return { valid: false, error: 'Comment is too long (max 1000 characters)' }
  }
  
  // Check for URLs
  if (URL_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Links are not allowed in comments' }
  }
  
  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Your comment was flagged as spam' }
    }
  }
  
  // Check for NSFW content
  for (const pattern of NSFW_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Please keep comments family-friendly' }
    }
  }
  
  // Check for excessive caps (shouting)
  if (hasExcessiveCaps(trimmed)) {
    return { valid: false, error: 'Please avoid using excessive capital letters' }
  }
  
  // Check for repetitive characters
  if (hasRepetitiveChars(trimmed)) {
    return { valid: false, error: 'Please avoid repetitive characters' }
  }
  
  // Check for only special characters or emojis
  const textWithoutEmojis = trimmed.replace(/[\p{Emoji}]/gu, '').trim()
  const textWithoutSpecial = textWithoutEmojis.replace(/[^a-zA-Z0-9\s]/g, '').trim()
  if (textWithoutSpecial.length < 2 && trimmed.length > 5) {
    return { valid: false, error: 'Please include some actual text in your comment' }
  }
  
  return { valid: true }
}

// Sanitize HTML entities and potential XSS
function sanitizeContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'video', 'author', 'status', 'createdAt'],
    group: 'Engagement',
  },
  access: {
    // Only approved comments are public, admins see all
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) {
        return {
          or: [
            { status: { equals: 'approved' } },
            { author: { equals: user.id } },
          ],
        }
      }
      return { status: { equals: 'approved' } }
    },
    // Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Only admins can update (moderation)
    update: ({ req: { user } }) => user?.role === 'admin',
    // Admins can delete, users can delete own comments
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { author: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 1000,
      validate: (value) => {
        if (!value) return 'Comment is required'
        const result = validateComment(value)
        if (!result.valid) return result.error
        return true
      },
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved', // Auto-approve for now, can change to 'pending'
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'IP address of commenter (for spam prevention)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Browser user agent',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-set author on create
        if (operation === 'create' && req.user && !data.author) {
          data.author = req.user.id
        }
        
        // Sanitize content
        if (data.content) {
          data.content = sanitizeContent(data.content)
        }
        
        // Capture IP and user agent for spam prevention
        if (operation === 'create') {
          const headers = req.headers
          data.ipAddress = headers?.get?.('x-forwarded-for') || 
                          headers?.get?.('x-real-ip') || 
                          'unknown'
          data.userAgent = headers?.get?.('user-agent') || 'unknown'
        }
        
        return data
      },
    ],
    beforeValidate: [
      async ({ data, operation }) => {
        // Additional validation before save
        if (operation === 'create' && data?.content) {
          const result = validateComment(data.content)
          if (!result.valid) {
            throw new Error(result.error)
          }
        }
        return data
      },
    ],
  },
}
