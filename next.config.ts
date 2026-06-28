import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [60, 70, 80, 85, 90],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    localPatterns: [
      { pathname: '/media/**' },
      { pathname: '/api/media/file/**' },
      { pathname: '/**' },
    ],
  },

  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  async rewrites() {
    return [
      {
        source: '/media/:filename',
        destination: '/api/media/file/:filename',
      },
    ]
  },
}

export default withPayload(nextConfig)
