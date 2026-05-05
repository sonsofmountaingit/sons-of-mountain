import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Галерия' }

export default async function GalleryPage() {
  const payload = await getPayload({ config })

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    limit: 20,
  })

  const images = destinations
    .flatMap((d) => (d.gallery as { image: { url?: string | null; alt: string } | null }[] | undefined) ?? [])
    .filter((item) => item.image?.url)
    .slice(0, 24)

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Галерия</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {images.map((item, i) =>
            item.image?.url ? (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ) : null
          )}
        </div>
        <div className="text-center">
          <Link href="/photos" className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors">
            Виж всички снимки →
          </Link>
        </div>
      </div>
    </div>
  )
}
