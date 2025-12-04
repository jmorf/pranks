import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { NavBar } from '@/components/NavBar'
import { Video } from '@/payload-types'
import { generateSEO } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = generateSEO({
  title: 'YouTube Pranks',
  description: 'Watch the best prank videos from YouTube. Classic and viral YouTube pranks all in one place.',
  url: '/youtube',
})

export default async function YouTubePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch approved YouTube videos
  const videosResult = await payload.find({
    collection: 'videos',
    where: {
      status: { equals: 'approved' },
      platform: { equals: 'youtube' },
    },
    limit: 50,
    sort: '-createdAt',
  })

  const videos = videosResult.docs as Video[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No YouTube videos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>
      
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
