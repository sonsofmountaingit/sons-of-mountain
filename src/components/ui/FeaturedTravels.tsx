import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { mediaUrl } from '@/lib/media-url'
import { FeaturedTravelsBlock, type FeaturedTravelItem } from '@/components/blocks/featured-travels/FeaturedTravelsBlock'
import { FeaturedTravelsEditButton } from './FeaturedTravelsEditButton'
import { translations, type Language } from '@/lib/translations'

interface FeaturedTravelsGlobal {
  heading?: string
  items?: Array<{
    relationTo: 'destinations' | 'trips' | 'programs'
    value: Record<string, unknown> | null
  }>
}

function str(v: unknown): string { return typeof v === 'string' ? v : '' }
function numOrNull(v: unknown): number | null { return typeof v === 'number' ? v : null }
function difficultyFromRatings(ratings: unknown): number | null {
  if (!Array.isArray(ratings) || !ratings.length) return null
  const match = ratings.find((r: unknown) => {
    if (!r || typeof r !== 'object') return false
    const label = (r as { label?: unknown }).label
    return typeof label === 'string' && label.toLowerCase().includes('difficulty')
  }) as { value?: unknown } | undefined
  const raw = match != null ? numOrNull(match.value) : numOrNull((ratings[0] as { value?: unknown })?.value)
  if (raw == null) return null
  return Math.max(1, Math.min(5, Math.round(raw)))
}
function imageUrl(v: unknown): string | null {
  if (v && typeof v === 'object' && 'url' in v && typeof (v as { url?: unknown }).url === 'string') {
    return mediaUrl((v as { url: string }).url)
  }
  return null
}

const BG_MONTHS = translations.BG.months.map((m) => m.charAt(0).toUpperCase() + m.slice(1))

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
          id: `destination-${doc.id}`,
          kind: 'destination' as const,
          region: (doc.type === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.name),
          subtitle: str(doc.introText),
          image: imageUrl(doc.heroImage),
          location: str(doc.location) || str(doc.name),
          month: typeof doc.month === 'string' ? doc.month : null,
          durationDays: null,
          price: numOrNull(doc.price),
          currency: 'EUR',
          spotsAvailable: numOrNull(doc.availableSpots),
          fitnessDifficulty: difficultyFromRatings(doc.fitnessRatings),
          href: `/destinations/${doc.slug}`,
        }
      }
      if (kind === 'trips') {
        const startDate = typeof doc.startDate === 'string' ? doc.startDate : null
        const endDate = typeof doc.endDate === 'string' ? doc.endDate : null
        return {
          id: `trip-${doc.id}`,
          kind: 'trip' as const,
          region: (doc.navSection === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.title),
          subtitle: str(doc.shortDescription),
          image: imageUrl(doc.heroImage),
          location: str(doc.location),
          month: monthFromDate(startDate),
          durationDays: durationDays(startDate, endDate),
          price: numOrNull(doc.price),
          currency: typeof doc.currency === 'string' ? doc.currency : 'EUR',
          spotsAvailable: numOrNull(doc.spotsAvailable),
          fitnessDifficulty: difficultyFromRatings(doc.fitnessRatings),
          href: doc.slug ? `/trips/${doc.slug}` : `/trips`,
        }
      }
      if (kind === 'programs') {
        const startDate = typeof doc.startDate === 'string' ? doc.startDate : null
        const endDate = typeof doc.endDate === 'string' ? doc.endDate : null
        return {
          id: `program-${doc.id}`,
          kind: 'program' as const,
          region: (doc.navSection === 'abroad' ? 'abroad' : 'bulgaria') as 'bulgaria' | 'abroad',
          title: str(doc.title),
          subtitle: str(doc.shortDescription),
          image: imageUrl(doc.heroImage),
          location: str(doc.location),
          month: monthFromDate(startDate),
          durationDays: durationDays(startDate, endDate),
          price: numOrNull(doc.price),
          currency: typeof doc.currency === 'string' ? doc.currency : 'EUR',
          spotsAvailable: numOrNull(doc.spotsAvailable),
          fitnessDifficulty: difficultyFromRatings(doc.fitnessRatings),
          href: doc.slug ? `/programs/${doc.slug}` : `/programs/${doc.id}`,
        }
      }
      return null
    }).filter(Boolean) as FeaturedTravelItem[]

    return { heading: g?.heading, items }
  } catch {
    return { heading: undefined, items: [] }
  }
}, ['featured-travels-data'], { tags: ['featured-travels'], revalidate: false })

export async function FeaturedTravels() {
  const { heading, items } = await getData()
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const language: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'
  const t = translations[language]
  return (
    <>
      <FeaturedTravelsBlock heading={heading ?? t.destination_page.choose_journey} items={items} emptyMessage={t.destination_page.no_data} />
      <FeaturedTravelsEditButton />
    </>
  )
}
