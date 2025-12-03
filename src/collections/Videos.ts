import type { CollectionConfig } from 'payload'

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .substring(0, 80) // Limit length
}

// Parse TikTok title to extract clean title and tags
function parseTikTokTitle(fullTitle: string): { displayTitle: string; tags: string[] } {
  // Find the first hashtag
  const hashtagIndex = fullTitle.indexOf('#')
  
  if (hashtagIndex === -1) {
    // No hashtags, use full title
    return { displayTitle: fullTitle.trim(), tags: [] }
  }
  
  // Get the clean title (before first hashtag)
  let displayTitle = fullTitle.substring(0, hashtagIndex).trim()
  
  // If the display title is empty or just emojis, use a fallback
  const textOnly = displayTitle.replace(/[\p{Emoji}]/gu, '').trim()
  if (textOnly.length < 3) {
    displayTitle = 'TikTok Prank Video'
  }
  
  // Extract all hashtags
  const hashtagPart = fullTitle.substring(hashtagIndex)
  const tagMatches = hashtagPart.match(/#[\w]+/g) || []
  
  // Clean up tags (remove # and convert to lowercase)
  const tags = tagMatches
    .map(tag => tag.substring(1).toLowerCase())
    .filter(tag => tag.length >= 2 && tag.length <= 30) // Filter out too short/long tags
    .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
    .slice(0, 10) // Limit to 10 tags
  
  return { displayTitle, tags }
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'displayTitle', 'slug', 'platform', 'status', 'originalAuthor', 'createdAt'],
    group: 'Content',
  },
  access: {
    // Anyone can read approved videos
    read: ({ req: { user } }) => {
      // Admins can read all videos
      if (user?.role === 'admin') {
        return true
      }
      // Users can read their own submissions
      if (user) {
        return {
          or: [
            { status: { equals: 'approved' } },
            { submittedBy: { equals: user.id } },
          ],
        }
      }
      // Public can only read approved videos
      return {
        status: { equals: 'approved' },
      }
    },
    // Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Only admins can update (for moderation)
    update: ({ req: { user } }) => user?.role === 'admin',
    // Only admins can delete
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Full video title from oEmbed (includes hashtags for TikTok)',
      },
    },
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        description: 'Clean display title (parsed from title, without hashtags)',
      },
    },
    {
      name: 'tags',
      type: 'json',
      admin: {
        description: 'Extracted hashtags from TikTok titles',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly slug (auto-generated from title)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Video description (auto-fetched from oEmbed if available)',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Original video URL as submitted',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Normalized embed URL for iframe',
      },
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'TikTok', value: 'tiktok' },
      ],
      admin: {
        description: 'Video platform (auto-detected)',
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Thumbnail URL (auto-fetched from oEmbed)',
      },
    },
    {
      name: 'originalAuthor',
      type: 'text',
      required: true,
      admin: {
        description: 'Creator name from YouTube/TikTok (required)',
      },
    },
    {
      name: 'originalAuthorUrl',
      type: 'text',
      admin: {
        description: 'Link to creator channel/profile (optional)',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of views on our platform',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Moderation status',
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'User who submitted this video',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Only process on create
        if (operation !== 'create') {
          return data
        }

        // Auto-set submittedBy to current user if not set
        if (!data.submittedBy && req.user) {
          data.submittedBy = req.user.id
        }

        // If sourceUrl is provided but other fields aren't, fetch from oEmbed
        if (data.sourceUrl && (!data.title || !data.thumbnailUrl)) {
          const oEmbedData = await fetchOEmbedData(data.sourceUrl)
          
          if (!oEmbedData) {
            throw new Error('Failed to fetch video metadata. Please check the URL and try again.')
          }

          // Merge oEmbed data with existing data (existing data takes precedence)
          data.title = data.title || oEmbedData.title
          data.description = data.description || oEmbedData.description
          data.embedUrl = data.embedUrl || oEmbedData.embedUrl
          data.platform = data.platform || oEmbedData.platform
          data.thumbnailUrl = data.thumbnailUrl || oEmbedData.thumbnailUrl
          data.originalAuthor = data.originalAuthor || oEmbedData.originalAuthor
          data.originalAuthorUrl = data.originalAuthorUrl || oEmbedData.originalAuthorUrl
        }

        // Validate required fields after oEmbed fetch
        if (!data.originalAuthor) {
          throw new Error('Could not determine video author. Please try a different URL.')
        }

        // Parse title for TikTok videos to extract clean title and tags
        if (data.title && data.platform === 'tiktok') {
          const { displayTitle, tags } = parseTikTokTitle(data.title)
          data.displayTitle = displayTitle
          data.tags = tags
        } else if (data.title) {
          // For YouTube, displayTitle is the same as title
          data.displayTitle = data.title
          data.tags = []
        }

        // Generate slug from displayTitle if not provided
        if (data.displayTitle && !data.slug) {
          const baseSlug = generateSlug(data.displayTitle)
          // Add random suffix to ensure uniqueness
          const suffix = Math.random().toString(36).substring(2, 8)
          data.slug = `${baseSlug}-${suffix}`
        }

        return data
      },
    ],
  },
}

// Helper types for oEmbed response
interface OEmbedResponse {
  title?: string
  author_name?: string
  author_url?: string
  thumbnail_url?: string
  html?: string
  description?: string
}

interface ParsedVideoData {
  title: string
  description?: string
  embedUrl: string
  platform: 'youtube' | 'tiktok'
  thumbnailUrl: string
  originalAuthor: string
  originalAuthorUrl?: string
}

// Parse video URL and fetch oEmbed data
async function fetchOEmbedData(url: string): Promise<ParsedVideoData | null> {
  try {
    const platform = detectPlatform(url)
    if (!platform) {
      throw new Error('Unsupported platform. Only YouTube and TikTok URLs are accepted.')
    }

    const videoId = extractVideoId(url, platform)
    if (!videoId) {
      throw new Error('Could not extract video ID from URL.')
    }

    const tiktokUsername = platform === 'tiktok' ? extractTikTokUsername(url) : null

    const oEmbedUrl = getOEmbedUrl(url, platform)
    const response = await fetch(oEmbedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PranksBot/1.0)',
      },
    })
    
    let data: OEmbedResponse = {}
    
    if (response.ok) {
      data = await response.json()
    } else if (platform === 'tiktok' && tiktokUsername) {
      // TikTok oEmbed sometimes fails, create a fallback
      console.log('TikTok oEmbed failed, using fallback')
      data = {
        title: `TikTok Video`,
        author_name: `@${tiktokUsername}`,
        author_url: `https://www.tiktok.com/@${tiktokUsername}`,
      }
    } else {
      throw new Error(`oEmbed request failed: ${response.status}`)
    }

    // Use fallback for author if oEmbed didn't return it
    const authorName = data.author_name || (tiktokUsername ? `@${tiktokUsername}` : null)
    if (!authorName) {
      throw new Error('Could not fetch author information from video.')
    }

    return {
      title: data.title || 'Untitled Video',
      description: data.description,
      embedUrl: getEmbedUrl(videoId, platform),
      platform,
      thumbnailUrl: data.thumbnail_url || getDefaultThumbnail(videoId, platform),
      originalAuthor: data.author_name,
      originalAuthorUrl: data.author_url,
    }
  } catch (error) {
    console.error('oEmbed fetch error:', error)
    return null
  }
}

// Detect platform from URL
function detectPlatform(url: string): 'youtube' | 'tiktok' | null {
  const lowerUrl = url.toLowerCase()
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube'
  }
  
  if (lowerUrl.includes('tiktok.com')) {
    return 'tiktok'
  }
  
  return null
}

// Get oEmbed API URL
function getOEmbedUrl(videoUrl: string, platform: 'youtube' | 'tiktok'): string {
  const encodedUrl = encodeURIComponent(videoUrl)
  
  if (platform === 'youtube') {
    return `https://www.youtube.com/oembed?url=${encodedUrl}&format=json`
  }
  
  if (platform === 'tiktok') {
    return `https://www.tiktok.com/oembed?url=${encodedUrl}`
  }
  
  throw new Error('Unsupported platform')
}

// Extract video ID from URL
function extractVideoId(url: string, platform: 'youtube' | 'tiktok'): string | null {
  if (platform === 'youtube') {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
  }
  
  if (platform === 'tiktok') {
    // TikTok video ID pattern
    const match = url.match(/\/video\/(\d+)/)
    if (match) return match[1]
    
    // Also try the short URL format
    const shortMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
    if (shortMatch) return shortMatch[1]
  }
  
  return null
}

// Extract TikTok username from URL
function extractTikTokUsername(url: string): string | null {
  const match = url.match(/tiktok\.com\/@([\w.]+)/)
  return match ? match[1] : null
}

// Get embed URL for iframe
function getEmbedUrl(videoId: string, platform: 'youtube' | 'tiktok'): string {
  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  if (platform === 'tiktok') {
    return `https://www.tiktok.com/embed/v2/${videoId}`
  }
  
  throw new Error('Unsupported platform')
}

// Get default thumbnail URL (fallback)
function getDefaultThumbnail(videoId: string, platform: 'youtube' | 'tiktok'): string {
  if (platform === 'youtube') {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
  
  // TikTok doesn't have a predictable thumbnail URL
  return '/tiktok-placeholder.svg'
}
