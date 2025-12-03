import React from 'react'
import './globals.css'

export const metadata = {
  description: "The internet's best prank videos, all in one place. Watch hilarious pranks from YouTube and TikTok.",
  title: {
    default: 'PRANKS.com - Best Prank Videos',
    template: '%s | PRANKS.com',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
