'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/AuthModal'
import { useSession, signOut } from '@/lib/authClient'
import { LogOut } from 'lucide-react'

export function Header() {
  const { data: session, isPending } = useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
              PRANKS.com
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {isPending ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : user ? (
              <>
                <Link href="/submit">
                  <Button size="sm" className="font-black text-xs md:text-sm">
                    SUBMIT VIDEO
                  </Button>
                </Link>
                <span className="text-sm font-bold text-muted-foreground hidden sm:block">
                  {user.name || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <AuthModal />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
