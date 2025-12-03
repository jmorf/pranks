import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { VideoPlayer } from '@/components/VideoPlayer'
import { VideoEngagement } from '@/components/VideoEngagement'
import { CommentSection } from '@/components/CommentSection'
import { ShareButtons } from '@/components/ShareButtons'
import { generateSEO, generateVideoSchema, generateBreadcrumbSchema, JsonLd } from '@/lib/seo'
import { Video, User, Comment } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface VideoPageProps {
  params: Promise<{ slug: string }>
}

// Helper to find video by slug or ID
async function findVideo(payload: any, slugOrId: string): Promise<Video | null> {
  // First try to find by slug
  const bySlug = await payload.find({
    collection: 'videos',
    where: { slug: { equals: slugOrId } },
    limit: 1,
  })
  
  if (bySlug.docs.length > 0) {
    return bySlug.docs[0] as Video
  }
  
  // Fallback to ID lookup (for backwards compatibility)
  try {
    const byId = await payload.findByID({
      collection: 'videos',
      id: slugOrId,
    })
    return byId as Video
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  try {
    const video = await findVideo(payload, slug)
    
    if (!video || video.status !== 'approved') {
      return generateSEO({ title: 'Video Not Found', noIndex: true })
    }
    
    const videoSlug = video.slug || video.id
    
    const videoTitle = (video as any).displayTitle || video.title
    
    return generateSEO({
      title: videoTitle,
      description: video.description || `Watch "${videoTitle}" by ${video.originalAuthor} on PRANKS`,

      image: video.thumbnailUrl,
      url: `/video/${videoSlug}`,
      video: {
        title: videoTitle,
        description: video.description || undefined,
        thumbnailUrl: video.thumbnailUrl,
        embedUrl: video.embedUrl,
        platform: video.platform,
        author: video.originalAuthor,
        authorUrl: video.originalAuthorUrl || undefined,
        publishedAt: video.createdAt,
        viewCount: video.viewCount || undefined,
      },
    })
  } catch {
    return generateSEO({ title: 'Video Not Found', noIndex: true })
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const video = await findVideo(payload, slug)
  
  if (!video || video.status !== 'approved') {
    notFound()
  }

  // Increment view count
  await payload.update({
    collection: 'videos',
    id: video.id,
    data: { viewCount: (video.viewCount || 0) + 1 },
    overrideAccess: true,
  })

  // Fetch likes count and user's like status
  const likesResult = await payload.find({
    collection: 'likes',
    where: { video: { equals: video.id } },
    limit: 0,
  })
  const likesCount = likesResult.totalDocs

  let userHasLiked = false
  if (user) {
    const userLike = await payload.find({
      collection: 'likes',
      where: {
        video: { equals: video.id },
        user: { equals: user.id },
      },
      limit: 1,
    })
    userHasLiked = userLike.docs.length > 0
  }

  // Fetch comments
  const commentsResult = await payload.find({
    collection: 'comments',
    where: {
      video: { equals: video.id },
      status: { equals: 'approved' },
    },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })
  const comments = commentsResult.docs as Comment[]

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pranks.com'
  const videoSlug = video.slug || video.id
  const videoUrl = `${siteUrl}/video/${videoSlug}`
  const videoDisplayTitle = (video as any).displayTitle || video.title

  const videoSchema = generateVideoSchema({
    name: videoDisplayTitle,
    description: video.description || `Watch "${videoDisplayTitle}" by ${video.originalAuthor}`,
    thumbnailUrl: video.thumbnailUrl,
    embedUrl: video.embedUrl,
    uploadDate: video.createdAt,
    author: video.originalAuthor,
    authorUrl: video.originalAuthorUrl || undefined,
    platform: video.platform,
    viewCount: (video.viewCount || 0) + 1,
  })

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: siteUrl },
      { name: videoDisplayTitle, url: videoUrl },
    ],
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={[videoSchema, breadcrumbSchema]} />
      <Header user={user as User | null} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <VideoPlayer video={video} />
          
          {/* Engagement Bar - Equal width buttons like DailyMotion */}
          <div className="mt-3 grid grid-cols-4 border-t border-b border-border">
            <div className="flex flex-col items-center justify-center py-3 border-r border-border">
              <span className="text-lg font-bold text-foreground">{((video.viewCount || 0) + 1).toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Views</span>
            </div>
            <VideoEngagement
              videoId={String(video.id)}
              likesCount={likesCount}
              userHasLiked={userHasLiked}
              isAuthenticated={!!user}
            />
            <ShareButtons
              url={videoUrl}
              title={videoDisplayTitle}
            />
            <button className="flex flex-col items-center justify-center py-3 hover:bg-muted/50 transition-colors">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="text-xs text-muted-foreground mt-1">More</span>
            </button>
          </div>
          
          {/* Video Info */}
          <div className="mt-4">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2">
              {(video as any).displayTitle || video.title}
            </h1>
            
            {/* Author */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {video.originalAuthor.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{video.originalAuthor}</p>
                {video.originalAuthorUrl && (
                  <a
                    href={video.originalAuthorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title={`View on ${video.platform === 'youtube' ? 'YouTube' : 'TikTok'}`}
                  >
                    {video.platform === 'youtube' ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    )}
                  </a>
                )}
              </div>
            </div>
            
            {/* Description */}
            {video.description && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}
          </div>
          
          {/* Comments */}
          <div className="mt-8">
            <CommentSection
              videoId={String(video.id)}
              initialComments={comments}
              isAuthenticated={!!user}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PRANKS.com. Made for laughs.
          </p>
        </div>
      </footer>
    </div>
  )
}
