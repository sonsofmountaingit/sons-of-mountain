import Image from 'next/image'
import Link from 'next/link'
import { mediaUrl } from '@/lib/media-url'

interface DestinationCard {
  name: string
  slug: string
  heroImage?: { url?: string | null; alt?: string } | null
  month?: string | null
}

interface Props {
  continent?: string | null
  destinations: DestinationCard[]
}

export function OtherDestinationsSection({ continent, destinations }: Props) {
  if (!destinations?.length) return null

  return (
    <section className="py-16 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-lg font-semibold mb-10">
          Други пътешествия{continent ? ` в ${continent}` : ''}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-animate="stagger-children">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="relative rounded-xl overflow-hidden aspect-[3/4] block group"
            >
              {mediaUrl(dest.heroImage?.url) ? (
                <Image
                  src={mediaUrl(dest.heroImage!.url)!}
                  alt={dest.heroImage?.alt ?? dest.name}
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-xl">{dest.name}</p>
                {dest.month && (
                  <p className="text-white/60 text-sm">{dest.month}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
