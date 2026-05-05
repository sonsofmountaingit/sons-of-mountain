import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      },
    ],
  },
  cacheComponents: true,
  experimental: {
    turbopackServerFastRefresh: false,
  },
}

export default withPayload(nextConfig)
