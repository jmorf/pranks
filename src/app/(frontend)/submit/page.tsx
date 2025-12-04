'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { SubmitForm } from '@/components/SubmitForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useSession } from '@/lib/authClient'

export default function SubmitPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Redirect to home if not authenticated (after loading)
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/')
    }
  }, [isPending, session, router])

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  // Don't render form if not authenticated
  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
            © {new Date().getFullYear()} PRANKS.com
          </p>
        </div>
      </footer>
    </div>
  )
}
