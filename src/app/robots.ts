import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/puck/',
          '/preview/',
          '/dashboard',
          '/account/',
          '/signup',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/vouchers/',
          '/shop/orders/',
          '/shop/success',
          '/shop/cancel',
          '/shop/checkout',
        ],
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Anthropic-AI', 'Bytespider', 'CCBot'],
        allow: '/',
        disallow: ['/admin', '/api/', '/puck/', '/preview/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
