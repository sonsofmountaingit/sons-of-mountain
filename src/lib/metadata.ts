import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

type StaticPageMeta = { title: string; description?: string; image?: string; keywords?: string }

const getSiteMetaGlobal = unstable_cache(
  async (): Promise<{
    pages: { path: string; title: string; description?: string; image?: { url?: string | null } | null; keywords?: string }[]
    defaultKeywords?: string
  }> => {
    try {
      const payload = await getPayload({ config })
      const global = await payload.findGlobal({ slug: 'site-meta', depth: 1, overrideAccess: true })
      return {
        pages: (global?.pages as { path: string; title: string; description?: string; image?: { url?: string | null } | null; keywords?: string }[] | null) ?? [],
        defaultKeywords: (global?.defaultKeywords as string | null) ?? undefined,
      }
    } catch {
      return { pages: [], defaultKeywords: undefined }
    }
  },
  ['site-meta-global'],
  { tags: ['site-meta'], revalidate: 3600 },
)

export async function getStaticPageMeta(path: string): Promise<StaticPageMeta | null> {
  const { pages } = await getSiteMetaGlobal()
  const normalized = path.startsWith('/') ? path : `/${path}`
  const entry = pages.find((p) => p.path === normalized)
  if (!entry) return null
  return {
    title: entry.title,
    description: entry.description ?? undefined,
    image: entry.image?.url ?? undefined,
    keywords: entry.keywords ?? undefined,
  }
}

export async function getDefaultKeywords(): Promise<string | undefined> {
  const { defaultKeywords } = await getSiteMetaGlobal()
  return defaultKeywords
}

export async function buildStaticMetadata(
  path: string,
  fallback: { title: string; description?: string; image?: string; keywords?: string },
): Promise<Metadata> {
  const meta = await getStaticPageMeta(path)
  const defaultKeywords = await getDefaultKeywords()
  return buildMetadata({
    title: meta?.title ?? fallback.title,
    description: meta?.description ?? fallback.description,
    slug: path.replace(/^\//, ''),
    image: meta?.image ?? fallback.image,
    keywords: meta?.keywords ?? fallback.keywords ?? defaultKeywords,
  })
}

export function buildMetadata({
  title,
  description,
  slug,
  image,
  keywords,
}: {
  title: string
  description?: string
  slug?: string
  image?: string
  keywords?: string
}): Metadata {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL
  const ogImage = image ?? `${BASE_URL}/og?title=${encodeURIComponent(title)}`
  const keywordsList = keywords
    ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : undefined

  return {
    title,
    description,
    keywords: keywordsList,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Sons of Mountains',
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
