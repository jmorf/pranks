import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https' as const,
        hostname: '**.tiktokcdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: '**.tiktokcdn-us.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'p16-sign-va.tiktokcdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'p16-sign-sg.tiktokcdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'p16-sign.tiktokcdn-us.com',
      },
    ],
  },
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
