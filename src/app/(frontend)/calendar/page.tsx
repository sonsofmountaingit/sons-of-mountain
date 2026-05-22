import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { mediaUrl } from '@/lib/media-url'
import { CalendarGrid, type MonthGroup } from '@/components/ui/CalendarGrid'
import type { CalendarItem } from '@/components/ui/CalendarTripCard'
import Script from 'next/script'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Календар с пътувания 2026 | Sons of Mountains',
  description: 'Всички предстоящи пътувания и програми по месец. Открий своето следващо приключение.',
  openGraph: {
    title: 'Календар с пътувания 2026 | Sons of Mountains',
    description: 'Всички предстоящи пътувания и програми по месец. Открий своето следващо приключение.',
    type: 'website',
  },
  alternates: { canonical: '/calendar' },
}

const MONTHS_BG = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']

type TripDoc = {
  id: string
  title?: string
  startDate?: string
  endDate?: string
  spotsAvailable?: number
  spotsTotal?: number
  price?: number
  currency?: string
  status?: string
  tags?: { tag?: string }[]
  destination?: {
    id?: string
    name?: string
    slug?: string
    type?: string
    heroImage?: { url?: string; alt?: string } | string
    latitude?: number
    longitude?: number
  } | string
}

type ProgramDoc = {
  id: string
  title?: string
  startDate?: string
  endDate?: string
  spotsAvailable?: number
  spotsTotal?: number
  price?: number
  currency?: string
  status?: string
  type?: string
  tags?: { tag?: string }[]
  slug?: string
  heroImage?: { url?: string; alt?: string } | string
  destination?: { name?: string; slug?: string; latitude?: number; longitude?: number } | string
  latitude?: number
  longitude?: number
}

async function fetchCalendarData() {
  'use cache'
  cacheTag('trips')
  cacheTag('programs')
  cacheLife('days')

  let tripsRes = { docs: [] as any[] }
  let programsRes = { docs: [] as any[] }
  try {
    const payload = await getPayload({ config })

    const results = await Promise.all([
      payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 500, depth: 2 }),
      payload.find({ collection: 'programs', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 500, depth: 2 }),
    ])
    tripsRes = results[0]
    programsRes = results[1]
  } catch {}

  const items: CalendarItem[] = []
  const itemCoords: Record<string, { lat: number; lng: number }> = {}

  for (const trip of tripsRes.docs as TripDoc[]) {
    if (!trip.startDate) continue
    const dest = typeof trip.destination === 'object' ? trip.destination : null
    const heroImg = dest?.heroImage && typeof dest.heroImage === 'object' ? dest.heroImage : null
    const type = dest?.type ?? 'abroad'
    items.push({
      id: trip.id,
      kind: 'trip',
      category: type === 'bulgaria' ? 'bulgaria' : 'abroad',
      title: trip.title ?? (dest?.name ?? ''),
      destinationName: dest?.name ?? '',
      destinationSlug: dest?.slug ?? null,
      imageUrl: mediaUrl(heroImg?.url) ?? null,
      imageAlt: heroImg?.alt ?? dest?.name ?? '',
      startDate: trip.startDate,
      endDate: trip.endDate ?? trip.startDate,
      spotsAvailable: trip.spotsAvailable ?? 0,
      spotsTotal: trip.spotsTotal ?? 0,
      status: (trip.status as CalendarItem['status']) ?? 'active',
      tags: (trip.tags ?? []).map((t) => t.tag ?? '').filter(Boolean),
      href: dest?.slug ? `/destinations/${dest.slug}` : '#',
    })
    if (dest?.latitude && dest?.longitude) {
      itemCoords[trip.id] = { lat: dest.latitude, lng: dest.longitude }
    }
  }

  for (const prog of programsRes.docs as ProgramDoc[]) {
    if (!prog.startDate) continue
    const heroImg = prog.heroImage && typeof prog.heroImage === 'object' ? prog.heroImage : null
    items.push({
      id: prog.id,
      kind: 'program',
      category: 'individual',
      title: prog.title ?? '',
      destinationName: typeof prog.destination === 'object' ? (prog.destination?.name ?? '') : '',
      destinationSlug: typeof prog.destination === 'object' ? (prog.destination?.slug ?? null) : null,
      imageUrl: mediaUrl(heroImg?.url) ?? null,
      imageAlt: heroImg?.alt ?? prog.title ?? '',
      startDate: prog.startDate,
      endDate: prog.endDate ?? prog.startDate,
      spotsAvailable: prog.spotsAvailable ?? 0,
      spotsTotal: prog.spotsTotal ?? 0,
      status: (prog.status as CalendarItem['status']) ?? 'active',
      tags: (prog.tags ?? []).map((t) => t.tag ?? '').filter(Boolean),
      href: prog.slug ? `/programs/${prog.slug}` : '#',
    })
    const lat = prog.latitude ?? (typeof prog.destination === 'object' ? prog.destination?.latitude : undefined)
    const lng = prog.longitude ?? (typeof prog.destination === 'object' ? prog.destination?.longitude : undefined)
    if (lat && lng) itemCoords[prog.id] = { lat, lng }
  }

  items.sort((a, b) => a.startDate.localeCompare(b.startDate))

  const byMonth = new Map<string, CalendarItem[]>()
  for (const item of items) {
    const d = new Date(item.startDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key)!.push(item)
  }

  const groups: MonthGroup[] = []
  for (const [key, monthItems] of byMonth) {
    const [yr, mo] = key.split('-').map(Number)
    groups.push({ year: yr, month: mo, label: `${MONTHS_BG[mo]} ${yr}`, items: monthItems })
  }

  const firstImage = items[0]?.imageUrl ?? null

  return { groups, firstImage, events: items, itemCoords }
}

async function CalendarContent() {
  const { groups, firstImage, events, itemCoords } = await fetchCalendarData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.slice(0, 50).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sons-of-mountains.com'}${item.href}`,
      },
    })),
  }

  if (firstImage && metadata.openGraph) {
    (metadata.openGraph as Record<string, unknown>).images = [firstImage]
  }

  return (
    <>
      <Script id="calendar-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalendarGrid groups={groups} initialWishlist={[]} loggedIn={false} allItems={events} itemCoords={itemCoords} />
    </>
  )
}

export default function CalendarPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Календар</h1>
        <p className="text-white/50 mb-12 text-lg">Предстоящи пътувания и програми по месец</p>
        <Suspense fallback={<div className="text-white/30 text-sm">Зареждане...</div>}>
          <CalendarContent />
        </Suspense>
      </div>
    </div>
  )
}
