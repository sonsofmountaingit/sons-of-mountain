import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export function buildMetadata({
  title,
  description,
  slug,
  image,
}: {
  title: string
  description?: string
  slug?: string
  image?: string
}): Metadata {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL
  const ogImage = image ?? `${BASE_URL}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Panic Frame',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'bg_BG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
