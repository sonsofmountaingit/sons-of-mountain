import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '')

function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `${BASE_URL}${path}`
}

type StaticPageMeta = { title?: string; description?: string; image?: string; keywords?: string }

const getPagesMeta = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'pages',
        limit: 100,
        depth: 1,
        draft: false,
        overrideAccess: true,
      })
      return docs as Array<{
        title: string
        slug: string
        meta?: {
          title?: string | null
          description?: string | null
          image?: { url?: string | null } | null
          keywords?: string | null
        } | null
      }>
    } catch {
      return []
    }
  },
  ['pages-meta-all'],
  { tags: ['pages'], revalidate: 3600 },
)

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
  const normalized = path.replace(/^\//, '')
  const slugCandidates = !normalized || normalized === 'home' || normalized === 'index'
    ? ['home', 'index', '', '/']
    : [normalized, `/${normalized}`, normalized.split('/').pop() ?? normalized]

  // 1. Try to find in 'pages' collection
  const pages = await getPagesMeta()
  const pageDoc = pages.find((p) => slugCandidates.includes(p.slug))
  if (pageDoc) {
    const meta = pageDoc.meta
    const title = meta?.title?.trim() || pageDoc.title
    const description = meta?.description?.trim() || undefined
    const image = meta?.image?.url ?? undefined
    const keywords = meta?.keywords?.trim() || undefined
    if (title || description || image || keywords) {
      return { title, description, image, keywords }
    }
  }

  // 2. Fallback to 'site-meta' global
  const { pages: siteMetaPages } = await getSiteMetaGlobal()
  const pathWithSlash = path.startsWith('/') ? path : `/${path}`
  const entry = siteMetaPages.find((p) => p.path === pathWithSlash || p.path === normalized)
  if (entry) {
    return {
      title: entry.title,
      description: entry.description ?? undefined,
      image: entry.image?.url ?? undefined,
      keywords: entry.keywords ?? undefined,
    }
  }

  return null
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
  autoOgImage,
  keywords,
}: {
  title: string
  description?: string
  slug?: string
  /** Explicit OG image (manual upload or static fallback) — used as-is, converted to absolute URL. */
  image?: string
  /** Hero image to auto-brand with the white logo via /og. Only used when `image` is not set. */
  autoOgImage?: string
  keywords?: string
}): Metadata {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL
  const rawOgImage = image
    ? toAbsoluteUrl(image)
    : autoOgImage
      ? `${BASE_URL}/og?${new URLSearchParams({ title, image: autoOgImage }).toString()}`
      : `${BASE_URL}/og?${new URLSearchParams({ title }).toString()}`
  const ogImage = rawOgImage ? toAbsoluteUrl(rawOgImage)! : `${BASE_URL}/og?${new URLSearchParams({ title }).toString()}`
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
