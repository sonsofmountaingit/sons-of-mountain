import Link from 'next/link'
import Image from 'next/image'

interface DestinationCardProps {
  name: string
  slug: string
  heroImage: { url?: string | null; alt: string } | null
  month?: string
  spotsAvailable?: number
  spotsTotal?: number
}

export function DestinationCard({
  name,
  slug,
  heroImage,
  month,
  spotsAvailable,
  spotsTotal,
}: DestinationCardProps) {
  const isSoldOut = spotsAvailable !== undefined && spotsAvailable === 0
  const hasSpots = spotsAvailable !== undefined && spotsAvailable > 0

  return (
    <Link
      href={`/destinations/${slug}`}
      className="group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block"
    >
      {heroImage?.url && (
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="280px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {month && (
          <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{month}</p>
        )}
        <h3 className="text-lg font-semibold text-white leading-tight mb-2">{name}</h3>
        {isSoldOut && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white/60 rounded-full">
            НЯМА МЕСТА
          </span>
        )}
        {hasSpots && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white text-black rounded-full">
            САМО {spotsAvailable} МЕСТА
          </span>
        )}
      </div>
    </Link>
  )
}
