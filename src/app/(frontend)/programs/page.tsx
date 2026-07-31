import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'
import { buildStaticMetadata } from '@/lib/metadata'
import { formatPrice } from '@/lib/currency'
import { SelectItemLink } from '@/components/analytics/SelectItemLink'
import { ViewItemListTracker } from '@/components/analytics/ViewItemListTracker'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/programs', {
    title: 'Индивидуални програми — Sons of Mountains',
    description: 'Персонализирани пътнически програми, създадени специално за теб. Избери дестинация и ние ще изградим идеалното пътешествие.',
  })
}

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  Yoga: 'Йога',
  Ski: 'Ски',
  Photography: 'Фотография',
  Sailing: 'Ветроходство',
  Hiking: 'Туризъм',
  Cultural: 'Културно',
  Wellness: 'Уелнес',
  Adventure: 'Приключение',
  Other: 'Друго',
}

const getPrograms = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'programs',
      where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
      limit: 200,
      sort: 'startDate',
      overrideAccess: true,
    })
    return docs
  },
  ['programs-list'],
  { tags: ['programs'], revalidate: false },
)

function ProgramCard({ program }: { program: Record<string, unknown> }) {
  const heroImage = program.heroImage as { url?: string | null; alt?: string } | null
  const imageUrl = mediaUrl(heroImage?.url)
  const slug = program.slug as string | null
  const href = slug ? `/programs/${slug}` : `/programs/${program.id}`
  const type = program.type as string | null
  const price = program.price as number | null
  const currency = (program.currency ?? 'EUR') as string
  const spotsAvailable = program.spotsAvailable as number | null
  const status = program.status as string | null
  const startDate = program.startDate as string | null
  const earlyBirdPrice = program.earlyBirdPrice as number | null
  const earlyBirdUntil = program.earlyBirdUntil as string | null
  const earlyBirdSpotsRemaining = (program.earlyBirdSpotsRemaining ?? program.earlyBirdSpots) as number | null
  const isEarlyBird = earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date() && (earlyBirdSpotsRemaining == null || earlyBirdSpotsRemaining > 0)
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpotsRemaining != null && earlyBirdSpotsRemaining > 0
    ? earlyBirdSpotsRemaining
    : null

  return (
    <SelectItemLink
      href={href}
      itemId={String(program.id)}
      itemName={program.title as string}
      price={price ?? 0}
      listId="programs"
      listName="Programs"
      itemCategory="program"
      className="group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heroImage?.alt ?? program.title as string}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
        {status === 'soldOut' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest">РАЗПРОДАДЕНО</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {type && (
            <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
              {PROGRAM_TYPE_LABELS[type] ?? type}
            </span>
          )}
          {isEarlyBird && status === 'active' && (
            <span className="bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">EARLY BIRD</span>
          )}
          {earlyBirdSpotsLeft != null && status === 'active' && (
            <span className="bg-black/70 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded">
              {earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? 'място' : 'места'}
            </span>
          )}
        </div>
        {spotsAvailable !== null && spotsAvailable <= 5 && status === 'active' && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {spotsAvailable} места
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg leading-tight mb-2">{program.title as string}</h3>
        {typeof program.shortDescription === 'string' && (
          <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
            {program.shortDescription}
          </p>
        )}
        {startDate && (
          <p className="text-white/40 text-xs mb-3">
            {new Date(startDate).toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' })}
          </p>
        )}
        {typeof program.location === 'string' && (
          <p className="text-white/40 text-xs mb-3">{program.location}</p>
        )}
        {(isEarlyBird || price !== null) && (
          <div className="flex items-baseline gap-2">
            {isEarlyBird && (
              <p className="text-orange-400 font-bold text-xl">{formatPrice(earlyBirdPrice)}</p>
            )}
            {price !== null && (
              <p className={`font-bold ${isEarlyBird ? 'text-white/30 line-through text-base' : 'text-white text-xl'}`}>{formatPrice(price)}</p>
            )}
          </div>
        )}
      </div>
    </SelectItemLink>
  )
}

async function ProgramsContent() {
  let programs: Record<string, unknown>[] = []
  try {
    programs = (await getPrograms()) as unknown as Record<string, unknown>[]
  } catch {}

  const active = programs

  let archived: Record<string, unknown>[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'programs',
      where: { status: { equals: 'archived' } },
      sort: '-startDate',
      limit: 100,
      overrideAccess: true,
    })
    archived = docs as unknown as Record<string, unknown>[]
  } catch {}

  return (
    <>
      <ViewItemListTracker
        listId="programs"
        listName="Programs"
        items={active.map((p: any) => ({ item_id: String(p.id), item_name: p.title, price: p.price ?? 0, item_category: 'program' }))}
      />
      {active.length === 0 && archived.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим програми.</p>
      )}
      {active.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((program) => (
            <ProgramCard key={program.id as string} program={program} />
          ))}
        </div>
      )}
      {archived.length > 0 && (
        <details className="mt-16 group">
          <summary className="cursor-pointer text-white/40 hover:text-white/70 transition-colors text-sm font-semibold uppercase tracking-widest mb-8 list-none flex items-center gap-2">
            <span className="border border-white/20 rounded px-3 py-1.5 group-open:border-white/40">
              Виж предходни програми ({archived.length})
            </span>
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 opacity-60">
            {archived.map((program) => (
              <ProgramCard key={program.id as string} program={program} />
            ))}
          </div>
        </details>
      )}
    </>
  )
}

async function ProgramsJsonLd() {
  let programs: Record<string, unknown>[] = []
  try { programs = (await getPrograms()) as unknown as Record<string, unknown>[] } catch {}
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Индивидуални програми — Sons of Mountains',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/programs`,
    itemListElement: programs.slice(0, 30).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Event', name: p.title, url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/programs/${p.slug}` },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default function ProgramsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProgramsJsonLd />
      </Suspense>
      <div className="pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Индивидуални програми</h1>
          <p className="text-white/50 mb-12 text-lg">
            Изцяло персонализирани пътувания — ние организираме всичко за теб
          </p>
          <Suspense fallback={null}>
            <ProgramsContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
