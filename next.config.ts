import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 75, 80, 88, 90],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
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
      { pathname: '/**' },
    ],
  },

  cacheComponents: true,
  experimental: {
    turbopackServerFastRefresh: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/media/file/:filename',
        destination: '/media/:filename',
      },
    ]
  },
}

export default withPayload(nextConfig)
