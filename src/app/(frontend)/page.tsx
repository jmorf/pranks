import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { NavBar } from '@/components/NavBar'
import { VideoGrid } from '@/components/VideoGrid'
import { Video, User } from '@/payload-types'
import { generateSEO, generateWebsiteSchema, JsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = generateSEO({
  title: 'Funny Prank Videos That Will Make You Laugh',
  description: "The internet's best prank videos, all in one place. Watch hilarious pranks from YouTube and TikTok.",
})

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Fetch approved videos
  const videosResult = await payload.find({
    collection: 'videos',
    where: {
      status: { equals: 'approved' },
    },
    limit: 50,
    sort: '-createdAt',
  })

  const videos = videosResult.docs as Video[]

  const websiteSchema = generateWebsiteSchema()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={websiteSchema} />
      <Header user={user as User | null} />
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <VideoGrid videos={videos} />
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
