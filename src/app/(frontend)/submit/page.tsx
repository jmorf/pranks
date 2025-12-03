import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { SubmitForm } from '@/components/SubmitForm'
import { User } from '@/payload-types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { generateSEO } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = generateSEO({
  title: 'Submit a Prank Video',
  description: 'Share your favorite prank video from YouTube or TikTok with the PRANKS.com community.',
  url: '/submit',
})

export default async function SubmitPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login?redirect=/submit')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user as User} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to videos
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-primary">
              SUBMIT A VIDEO
            </h1>
            <p className="text-muted-foreground mt-2">
              Share a funny prank video from YouTube or TikTok. All submissions are reviewed before being published.
            </p>
          </div>

          {/* Form */}
          <SubmitForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PRANKS.com
          </p>
        </div>
      </footer>
    </div>
  )
}
