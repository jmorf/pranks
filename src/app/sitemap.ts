import { getPayload } from 'payload'
import config from '@/payload.config'
import { Video } from '@/payload-types'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pranks.com'
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/most-popular`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tiktok`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/youtube`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Fetch all approved videos for dynamic pages
  const videosResult = await payload.find({
    collection: 'videos',
    where: {
      status: { equals: 'approved' },
    },
    limit: 1000,
    sort: '-createdAt',
  })

  const videos = videosResult.docs as Video[]

  const videoPages: MetadataRoute.Sitemap = videos.map((video) => {
    // Use slug if available, fallback to ID
    const videoPath = video.slug || video.id
    return {
      url: `${siteUrl}/video/${videoPath}`,
      lastModified: new Date(video.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // Collect all unique tags from videos
  const allTags = new Set<string>()
  videos.forEach((video) => {
    const tags = video.tags as string[] | null | undefined
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => allTags.add(tag))
    }
  })

  const tagPages: MetadataRoute.Sitemap = Array.from(allTags).map((tag) => ({
    url: `${siteUrl}/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...videoPages, ...tagPages]
}
