'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'RANDOM', labelFull: 'SURF VIDEOS RANDOMLY' },
  { href: '/most-popular', label: 'POPULAR', labelFull: 'WATCH POPULAR VIDEOS' },
  { href: '/trending', label: 'TRENDING', labelFull: 'TRENDING' },
  { href: '/tiktok', label: 'TIKTOK', labelFull: 'TIKTOK' },
  { href: '/youtube', label: 'YOUTUBE', labelFull: 'YOUTUBE' },
]

export function NavBar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-primary sticky top-16 z-40">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-start md:justify-center gap-1 md:gap-4 px-4 py-3 min-w-max">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-xs md:text-base font-black whitespace-nowrap transition-colors tracking-wide px-2 py-1',
                  isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <span className="md:hidden">{item.label}</span>
                <span className="hidden md:inline">{item.labelFull}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
