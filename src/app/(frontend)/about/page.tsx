import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'
import { About } from '@/components/ui/About'

export const dynamic = 'force-dynamic'

const getAboutMeta = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'about', depth: 1, overrideAccess: true })
    } catch {
      return null
    }
  },
  ['about-meta'],
  { tags: ['about'], revalidate: 3600 },
)

export async function generateMetadata(): Promise<Metadata> {
  const d = (await getAboutMeta()) as any
  const title = 'За нас — Sons of Mountains'
  const description =
    d?.heroSubtext ??
    'Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението.'
  const ogImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots: { index: true, follow: true },
  }
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sons of Mountains',
    url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com',
    logo: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/logo.png`,
    sameAs: [
      'https://facebook.com/panicframe',
      'https://instagram.com/panicframe',
    ],
    description: 'Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <About />
    </>
  )
}
