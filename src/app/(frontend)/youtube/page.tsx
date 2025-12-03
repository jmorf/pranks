import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { NavBar } from '@/components/NavBar'
import { Video, User } from '@/payload-types'
import { generateSEO } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = generateSEO({
  title: 'YouTube Pranks',
  description: 'Watch the best prank videos from YouTube. Classic and viral YouTube pranks all in one place.',
  url: '/youtube',
})

export default async function YouTubePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

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
      <Header user={user as User | null} />
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
          <p className="text-sm font-bold text-primary">
            MORE AWESOME VIDEOS AWAIT. YOU SHOULD WATCH THEM TOO.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} PRANKS.com. No feelings were harmed.
          </p>
        </div>
      </footer>
    </div>
  )
}
