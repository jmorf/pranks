'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from '@/payload-types'
import { AuthModal } from '@/components/AuthModal'

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
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
            {user ? (
              <>
                <Link href="/submit">
                  <Button size="sm" className="font-black text-xs md:text-sm">
                    SUBMIT VIDEO
                  </Button>
                </Link>
                <Link 
                  href="/admin" 
                  className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                >
                  {user.name || user.email}
                </Link>
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
