import type { Metadata } from 'next'

const SITE_NAME = 'PRANKS.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pranks.com'
const DEFAULT_DESCRIPTION = "The internet's best prank videos, all in one place. Watch hilarious pranks from YouTube and TikTok."
const DEFAULT_IMAGE = '/og-image.png'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'video.other'
  video?: {
    title: string
    description?: string
    thumbnailUrl: string
    embedUrl: string
    platform: 'youtube' | 'tiktok'
    author: string
    authorUrl?: string
    publishedAt?: string
    duration?: number
    viewCount?: number
  }
  noIndex?: boolean
}

export function generateSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  video,
  noIndex = false,
}: SEOProps = {}): Metadata {
  // Just use title as-is - layout template will add " | PRANKS.com"
  const displayTitle = title || SITE_NAME
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`
  const absoluteUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`

  return {
    title: displayTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      locale: 'en_US',
      type: video ? 'video.other' : type,
      ...(video && {
        videos: [
          {
            url: video.embedUrl,
            secureUrl: video.embedUrl,
            type: 'text/html',
            width: 1280,
            height: 720,
          },
        ],
      }),
    },
    twitter: {
      card: video ? 'player' : 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteImage],
      ...(video && {
        players: [
          {
            playerUrl: video.embedUrl,
            streamUrl: video.embedUrl,
            width: 1280,
            height: 720,
          },
        ],
      }),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    other: video
      ? {
          'video:duration': video.duration?.toString() || '',
          'video:release_date': video.publishedAt || '',
        }
      : undefined,
  }
}

// Schema.org structured data components
interface VideoSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  embedUrl: string
  uploadDate: string
  author: string
  authorUrl?: string
  platform: 'youtube' | 'tiktok'
  viewCount?: number
}

export function generateVideoSchema({
  name,
  description,
  thumbnailUrl,
  embedUrl,
  uploadDate,
  author,
  authorUrl,
  platform,
  viewCount,
}: VideoSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    embedUrl,
    uploadDate,
    author: {
      '@type': 'Person',
      name: author,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: platform === 'youtube' ? 'YouTube' : 'TikTok',
      logo: {
        '@type': 'ImageObject',
        url: platform === 'youtube'
          ? 'https://www.youtube.com/favicon.ico'
          : 'https://www.tiktok.com/favicon.ico',
      },
    },
    ...(viewCount && { interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/WatchAction',
      userInteractionCount: viewCount,
    }}),
  }
}

interface WebsiteSchemaProps {
  name?: string
  description?: string
  url?: string
}

export function generateWebsiteSchema({
  name = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  url = SITE_URL,
}: WebsiteSchemaProps = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function generateBreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// React component for JSON-LD
interface JsonLdProps {
  data: object | object[]
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLdArray = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLdArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
