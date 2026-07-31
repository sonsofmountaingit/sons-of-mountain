import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'
import { SelectItemLink } from '@/components/analytics/SelectItemLink'

interface DestinationCardProps {
  id?: string
  name: string
  slug: string
  href?: string
  heroImage: { url?: string | null; alt: string } | null
  month?: string
  spotsAvailable?: number
  spotsTotal?: number
  earlyBirdPrice?: number | null
  earlyBirdUntil?: string | null
  earlyBirdSpots?: number | null
  label?: string
  price?: number | null
  itemCategory?: 'destination' | 'trip'
  listId?: string
  listName?: string
}

export function DestinationCard({
  id,
  name,
  slug,
  href,
  heroImage,
  month,
  spotsAvailable,
  spotsTotal,
  earlyBirdPrice,
  earlyBirdUntil,
  earlyBirdSpots,
  label,
  price,
  itemCategory = 'destination',
  listId = 'destinations',
  listName = 'Destinations',
}: DestinationCardProps) {
  const isSoldOut = spotsAvailable !== undefined && spotsAvailable === 0
  const hasSpots =
    spotsAvailable !== undefined &&
    spotsAvailable > 0 &&
    (spotsTotal === undefined || spotsAvailable <= spotsTotal * 0.5)
  const isEarlyBird = !!(earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date() && (earlyBirdSpots == null || earlyBirdSpots > 0))
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpots != null && earlyBirdSpots > 0
    ? earlyBirdSpots
    : null

  return (
    <SelectItemLink
      href={href ?? `/destinations/${slug}`}
      itemId={id ?? slug}
      itemName={name}
      price={price ?? 0}
      listId={listId}
      listName={listName}
      itemCategory={itemCategory}
      className="group relative w-full sm:w-[280px] aspect-[3/4] rounded-lg overflow-hidden block"
    >
      {mediaUrl(heroImage?.url) && (
        <Image
          src={mediaUrl(heroImage!.url)!}
          alt={heroImage?.alt ?? ''}
          fill
          quality={80}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 280px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {label && (
        <span className="absolute top-3 right-3 bg-black/70 text-white/80 text-xs font-semibold px-2 py-0.5 rounded">
          {label}
        </span>
      )}
      {isEarlyBird && (
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded">РАННО ЗАПИСВАНЕ</span>
          {earlyBirdSpotsLeft != null && (
            <span className="bg-black/70 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded">
              {earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? 'място' : 'места'}
            </span>
          )}
        </div>
      )}
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
    </SelectItemLink>
  )
}
