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
          
          {/* Video Info */}
          <div className="mt-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2">
                  {(video as any).displayTitle || video.title}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span>{(video.viewCount || 0) + 1} views</span>
                  <span>•</span>
                  <span>
                    {new Date(video.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              
              {/* Platform Badge */}
              <div className={`
                px-3 py-1 text-xs font-bold uppercase
                ${video.platform === 'youtube' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-black text-white'}
              `}>
                {video.platform}
              </div>
            </div>
            
            {/* Author */}
            <div className="mt-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {video.originalAuthor.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">{video.originalAuthor}</p>
                {video.originalAuthorUrl && (
                  <a
                    href={video.originalAuthorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View channel
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
            
            {/* Engagement Bar */}
            <div className="mt-6 flex items-center gap-4 flex-wrap">
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
            </div>
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
      <footer className="mt-auto border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PRANKS.com. Made for laughs.
          </p>
        </div>
      </footer>
    </div>
  )
}
