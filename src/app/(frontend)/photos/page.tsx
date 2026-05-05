import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Всички снимки' }

export default async function PhotosPage() {
  const payload = await getPayload({ config })

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    limit: 50,
  })

  const images = destinations
    .flatMap((d) => (d.gallery as { image: { url?: string | null; alt: string } | null }[] | undefined) ?? [])
    .filter((item) => item.image?.url)

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-12">Всички снимки</h1>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((item, i) =>
            item.image?.url ? (
              <div key={i} className="relative break-inside-avoid rounded-lg overflow-hidden">
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  width={400}
                  height={500}
                  className="w-full object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
