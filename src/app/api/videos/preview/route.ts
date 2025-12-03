import { NextRequest, NextResponse } from 'next/server'

interface OEmbedResponse {
  title?: string
  author_name?: string
  author_url?: string
  thumbnail_url?: string
  html?: string
  description?: string
}

interface VideoPreview {
  title: string
  description?: string
  thumbnailUrl: string
  originalAuthor: string
  originalAuthorUrl?: string
  platform: 'youtube' | 'tiktok'
  embedUrl: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: string }
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const platform = detectPlatform(url)
    if (!platform) {
      return NextResponse.json(
        { error: 'Unsupported platform. Only YouTube and TikTok URLs are accepted.' },
        { status: 400 }
      )
    }

    const videoId = extractVideoId(url, platform)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL.' },
        { status: 400 }
      )
    }

    // For TikTok, extract username from URL
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
    } else if (platform === 'tiktok') {
      // TikTok oEmbed sometimes fails, create a fallback
      console.log('TikTok oEmbed failed, using fallback')
      data = {
        title: `TikTok Video`,
        author_name: tiktokUsername ? `@${tiktokUsername}` : 'TikTok Creator',
        author_url: tiktokUsername ? `https://www.tiktok.com/@${tiktokUsername}` : undefined,
      }
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch video information. Please check the URL.' },
        { status: 400 }
      )
    }

    if (!data.author_name && !tiktokUsername) {
      return NextResponse.json(
        { error: 'Could not fetch author information from video.' },
        { status: 400 }
      )
    }

    const preview: VideoPreview = {
      title: data.title || 'Untitled Video',
      description: data.description,
      thumbnailUrl: data.thumbnail_url || getDefaultThumbnail(videoId, platform),
      originalAuthor: data.author_name || (tiktokUsername ? `@${tiktokUsername}` : 'Unknown'),
      originalAuthorUrl: data.author_url,
      platform,
      embedUrl: getEmbedUrl(videoId, platform),
    }

    return NextResponse.json(preview)
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video preview. Please try again.' },
      { status: 500 }
    )
  }
}

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

function extractVideoId(url: string, platform: 'youtube' | 'tiktok'): string | null {
  if (platform === 'youtube') {
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
    const match = url.match(/\/video\/(\d+)/)
    if (match) return match[1]
    
    const shortMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
    if (shortMatch) return shortMatch[1]
  }
  
  return null
}

function extractTikTokUsername(url: string): string | null {
  const match = url.match(/tiktok\.com\/@([\w.]+)/)
  return match ? match[1] : null
}

function getEmbedUrl(videoId: string, platform: 'youtube' | 'tiktok'): string {
  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  if (platform === 'tiktok') {
    return `https://www.tiktok.com/embed/v2/${videoId}`
  }
  
  throw new Error('Unsupported platform')
}

function getDefaultThumbnail(videoId: string, platform: 'youtube' | 'tiktok'): string {
  if (platform === 'youtube') {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
  
  // TikTok doesn't have a predictable thumbnail URL
  // We'll use a placeholder or let the embed handle it
  return '/tiktok-placeholder.svg'
}
