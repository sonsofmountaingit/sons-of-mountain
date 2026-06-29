import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { mediaUrl } from '@/lib/media-url'
import { FeaturedTravelsBlock, type FeaturedTravelItem } from '@/components/blocks/featured-travels/FeaturedTravelsBlock'
import { FeaturedTravelsEditButton } from './FeaturedTravelsEditButton'

interface FeaturedTravelsGlobal {
  heading?: string
  items?: Array<{
    relationTo: 'destinations' | 'trips' | 'programs'
    value: Record<string, unknown> | null
  }>
}

function str(v: unknown): string { return typeof v === 'string' ? v : '' }
function numOrNull(v: unknown): number | null { return typeof v === 'number' ? v : null }
function imageUrl(v: unknown): string | null {
  if (v && typeof v === 'object' && 'url' in v && typeof (v as { url?: unknown }).url === 'string') {
    return mediaUrl((v as { url: string }).url)
  }
  return null
}

const BG_MONTHS = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']

function monthFromDate(date: string | null | undefined): string | null {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  return BG_MONTHS[d.getMonth()] ?? null
}

function durationDays(start: string | null | undefined, end: string | null | undefined): number | null {
  if (!start || !end) return null
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (isNaN(ms) || ms <= 0) return null
  return Math.round(ms / 86400000) + 1
}

const getData = unstable_cache(async () => {
  try {
    const payload = await getPayload({ config })
    const g = await payload.findGlobal({ slug: 'featured-travels', depth: 2, overrideAccess: true, draft: true }) as unknown as FeaturedTravelsGlobal

    const rawItems = g?.items ?? []

    const items: FeaturedTravelItem[] = rawItems.map((rel) => {
      if (!rel || typeof rel !== 'object') return null
      const kind = rel.relationTo
      const doc = rel.value as Record<string, unknown> | null
      if (!doc || typeof doc !== 'object') return null

      if (kind === 'destinations') {
        return {
          id: String(doc.id),
          kind: 'destination' as const,
          region: (doc.type === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.name),
          subtitle: str(doc.introText),
          image: imageUrl(doc.heroImage),
          location: str(doc.name),
          month: typeof doc.month === 'string' ? doc.month : null,
          durationDays: null,
          price: numOrNull(doc.price),
          currency: 'EUR',
          spotsAvailable: numOrNull(doc.availableSpots),
          href: `/destinations/${doc.slug}`,
        }
      }
      if (kind === 'trips') {
        const startDate = typeof doc.startDate === 'string' ? doc.startDate : null
        const endDate = typeof doc.endDate === 'string' ? doc.endDate : null
        return {
          id: String(doc.id),
          kind: 'trip' as const,
          region: (doc.type === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.title),
          subtitle: str(doc.shortDescription),
          image: imageUrl(doc.heroImage),
          location: str(doc.location),
          month: monthFromDate(startDate),
          durationDays: durationDays(startDate, endDate),
          price: numOrNull(doc.price),
          currency: typeof doc.currency === 'string' ? doc.currency : 'EUR',
          spotsAvailable: numOrNull(doc.spotsAvailable),
          href: doc.slug ? `/trips/${doc.slug}` : `/trips`,
        }
      }
      if (kind === 'programs') {
        const startDate = typeof doc.startDate === 'string' ? doc.startDate : null
        const endDate = typeof doc.endDate === 'string' ? doc.endDate : null
        return {
          id: String(doc.id),
          kind: 'program' as const,
          region: (doc.type === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.title),
          subtitle: str(doc.shortDescription),
          image: imageUrl(doc.heroImage),
          location: str(doc.location),
          month: monthFromDate(startDate),
          durationDays: durationDays(startDate, endDate),
          price: numOrNull(doc.price),
          currency: typeof doc.currency === 'string' ? doc.currency : 'EUR',
          spotsAvailable: numOrNull(doc.spotsAvailable),
          href: doc.slug ? `/programs/${doc.slug}` : `/programs/${doc.id}`,
        }
      }
      return null
    }).filter(Boolean) as FeaturedTravelItem[]

    return { heading: g?.heading ?? 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ', items }
  } catch {
    return { heading: 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ', items: [] }
  }
}, ['featured-travels-data'], { tags: ['featured-travels'], revalidate: false })

export async function FeaturedTravels() {
  const { heading, items } = await getData()
  return (
    <>
      <FeaturedTravelsBlock heading={heading} items={items} emptyMessage="В момента няма данни" />
      <FeaturedTravelsEditButton />
    </>
  )
}
