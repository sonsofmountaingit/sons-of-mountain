import Image from 'next/image'
import Link from 'next/link'

export type FeaturedTravelItem = {
  id: string
  kind: 'destination' | 'trip' | 'program'
  title: string
  subtitle: string
  image: string | null
  location: string
  month: string | null
  durationDays: number | null
  price: number | null
  currency: string
  spotsAvailable: number | null
  href: string
}

const KIND_LABEL: Record<string, string> = {
  destination: 'Дестинация',
  trip: 'Пътуване',
  program: 'Програма',
}

// 3-column CSS grid.
// index 0 → full width (col-span-3)
// Then repeating 4-card cycle:
//   cycle 0 → wide-left  (col-span-2)
//   cycle 1 → narrow-right (col-span-1)
//   cycle 2 → narrow-left  (col-span-1)
//   cycle 3 → wide-right (col-span-2)
type CardPos = 'full' | 'wide-left' | 'narrow-right' | 'narrow-left' | 'wide-right'

function getPos(index: number): CardPos {
  if (index === 0) return 'full'
  const cycle = (index - 1) % 4
  if (cycle === 0) return 'wide-left'
  if (cycle === 1) return 'narrow-right'
  if (cycle === 2) return 'narrow-left'
  return 'wide-right'
}

function cardClass(pos: CardPos): string {
  if (pos === 'full') return 'col-span-3'
  if (pos === 'wide-left') return 'col-span-3 md:col-span-2'
  if (pos === 'narrow-right') return 'col-span-3 md:col-span-1'
  if (pos === 'narrow-left') return 'col-span-3 md:col-span-1'
  return 'col-span-3 md:col-span-2'
}

function InfoRow({ location, month, durationDays, price, currency }: Pick<FeaturedTravelItem, 'location' | 'month' | 'durationDays' | 'price' | 'currency'>) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/80 mt-3">
      {location && (
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 shrink-0">
            <rect x="2" y="3" width="7" height="7" rx="1"/><rect x="13" y="3" width="9" height="7" rx="1"/><rect x="2" y="14" width="13" height="7" rx="1"/><rect x="19" y="14" width="3" height="7" rx="1"/>
          </svg>
          {location}
        </span>
      )}
      {month && (
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {month}
        </span>
      )}
      {durationDays && (
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 shrink-0">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h5"/>
          </svg>
          {durationDays} {durationDays === 1 ? 'ден' : 'дни'}
        </span>
      )}
      {price != null && (
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 shrink-0">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H9"/>
          </svg>
          {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'}{price.toLocaleString('bg-BG')}
        </span>
      )}
    </div>
  )
}

function SpotsBadge({ spotsAvailable }: { spotsAvailable: number | null }) {
  if (spotsAvailable === null) return null
  if (spotsAvailable === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/80 text-white backdrop-blur-sm">
        Няма места
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/80 text-white backdrop-blur-sm">
      {spotsAvailable} {spotsAvailable === 1 ? 'място' : 'места'}
    </span>
  )
}

function TravelCard({ item, pos }: { item: FeaturedTravelItem; pos: CardPos }) {
  const isWide = pos === 'full' || pos === 'wide-left' || pos === 'wide-right'
  const isFull = pos === 'full'
  return (
    <Link
      href={item.href}
      className={`group relative overflow-hidden rounded-2xl block ${isFull ? 'h-[60vw] max-h-[720px] min-h-[480px]' : 'h-[520px] md:h-[600px]'} ${cardClass(pos)}`}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={isFull ? '100vw' : isWide ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          priority={pos === 'full' || pos === 'wide-left'}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* top badges */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-black/40 text-white backdrop-blur-md border border-white/20 uppercase tracking-wider">
          {KIND_LABEL[item.kind] ?? item.kind}
        </span>
        <SpotsBadge spotsAvailable={item.spotsAvailable} />
      </div>

      {/* bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className={`font-bold text-white leading-tight ${isFull ? 'text-3xl md:text-4xl lg:text-5xl' : isWide ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-sm text-white/70 mt-2 line-clamp-2 leading-relaxed max-w-lg">
            {item.subtitle}
          </p>
        )}
        <InfoRow
          location={item.location}
          month={item.month}
          durationDays={item.durationDays}
          price={item.price}
          currency={item.currency}
        />
      </div>
    </Link>
  )
}

export function FeaturedTravelsBlock({ heading, items }: { heading: string; items: FeaturedTravelItem[] }) {
  if (!items.length) return null

  return (
    <section className="py-16 px-3 md:px-4 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <TravelCard key={`${item.kind}-${item.id}-${i}`} item={item} pos={getPos(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
