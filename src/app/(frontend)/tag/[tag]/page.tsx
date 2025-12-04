import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { NavBar } from '@/components/NavBar'
import { VideoGrid } from '@/components/VideoGrid'
import { Video } from '@/payload-types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const capitalizedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1)
  
  return {
    title: `#${capitalizedTag} Videos`,
    description: `Watch funny prank videos tagged with #${decodedTag} on PRANKS.com`,
    openGraph: {
      title: `#${capitalizedTag} Prank Videos | PRANKS.com`,
      description: `Watch funny prank videos tagged with #${decodedTag}`,
      type: 'website',
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag).toLowerCase()
  
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Find videos with this tag
  // Since tags is a JSON field, we need to search for videos containing this tag
  const { docs: allVideos } = await payload.find({
    collection: 'videos',
    where: {
      status: { equals: 'approved' },
    },
    limit: 100,
    sort: '-createdAt',
  })

  // Filter videos that have this tag
  const videos = (allVideos as Video[]).filter((video) => {
    const tags = video.tags as string[] | null | undefined
    return tags && Array.isArray(tags) && tags.includes(decodedTag)
  })

  const capitalizedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NavBar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Back link and title */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all videos
            </Link>
            <h1 className="text-2xl md:text-3xl font-black text-primary">
              #{capitalizedTag}
            </h1>
            <p className="text-muted-foreground mt-1">
              {videos.length} video{videos.length !== 1 ? 's' : ''} tagged with #{decodedTag}
            </p>
          </div>

          {videos.length > 0 ? (
            <VideoGrid videos={videos} showTags={true} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No videos found with this tag.
              </p>
              <Link 
                href="/" 
                className="text-primary hover:underline mt-2 inline-block"
              >
                Browse all videos
              </Link>
            </div>
          )}
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
          <p className="text-sm font-bold text-primary">
            KEEP SCROLLING. YOUR BOSS ISN&apos;T WATCHING. PROBABLY.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} PRANKS.com. No feelings were harmed.
          </p>
        </div>
      </footer>
    </div>
  )
}
