import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'

const getMegamenuData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const [bulgariaDests, abroadDests, bulgariaTrips, abroadTrips, individualTrips, bulgariaPrograms, abroadPrograms, individualPrograms] = await Promise.all([
      payload.find({
        collection: 'destinations',
        where: { and: [{ type: { equals: 'bulgaria' } }, { bookingStatus: { not_equals: 'archived' } }, { _status: { equals: 'published' } }] },
        limit: 30,
        select: { name: true, slug: true, heroImage: true },
        depth: 1,
      }),
      payload.find({
        collection: 'destinations',
        where: { and: [{ type: { equals: 'abroad' } }, { bookingStatus: { not_equals: 'archived' } }, { _status: { equals: 'published' } }] },
        limit: 30,
        select: { name: true, slug: true, heroImage: true },
        depth: 1,
      }),
      payload.find({
        collection: 'trips',
        where: { and: [{ status: { equals: 'active' } }, { navSection: { equals: 'bulgaria' } }] },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, startDate: true, spotsAvailable: true, price: true, currency: true },
        depth: 1,
      }),
      payload.find({
        collection: 'trips',
        where: { and: [{ status: { equals: 'active' } }, { navSection: { equals: 'abroad' } }] },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, startDate: true, spotsAvailable: true, price: true, currency: true },
        depth: 1,
      }),
      payload.find({
        collection: 'trips',
        where: { and: [{ status: { equals: 'active' } }, { navSection: { equals: 'individual' } }] },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, startDate: true, spotsAvailable: true, price: true, currency: true },
        depth: 1,
      }),
      payload.find({
        collection: 'programs',
        where: { navSection: { equals: 'bulgaria' } },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, price: true, currency: true, spotsAvailable: true },
        depth: 1,
      }),
      payload.find({
        collection: 'programs',
        where: { navSection: { equals: 'abroad' } },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, price: true, currency: true, spotsAvailable: true },
        depth: 1,
      }),
      payload.find({
        collection: 'programs',
        where: { navSection: { equals: 'individual' } },
        limit: 20,
        select: { title: true, slug: true, heroImage: true, price: true, currency: true, spotsAvailable: true },
        depth: 1,
      }),
    ])

    function mapDest(d: any) {
      return {
        name: d.name as string,
        slug: d.slug as string,
        image: (typeof d.heroImage === 'object' ? d.heroImage?.url : null) as string | null,
      }
    }

    function mapTrip(t: any) {
      return {
        kind: 'trip' as const,
        title: t.title as string,
        slug: t.slug as string,
        image: (typeof t.heroImage === 'object' ? t.heroImage?.url : null) as string | null,
        startDate: t.startDate as string | null,
        spotsAvailable: (t.spotsAvailable ?? 0) as number,
        price: t.price as number,
        currency: t.currency as string,
      }
    }

    function mapProgram(p: any) {
      return {
        kind: 'program' as const,
        title: p.title as string,
        slug: p.slug as string,
        image: (typeof p.heroImage === 'object' ? p.heroImage?.url : null) as string | null,
        startDate: null,
        spotsAvailable: (p.spotsAvailable ?? 0) as number,
        price: p.price as number,
        currency: (p.currency ?? 'EUR') as string,
      }
    }

    return {
      bulgaria: bulgariaDests.docs.map(mapDest),
      abroad: abroadDests.docs.map(mapDest),
      bulgariaItems: [...bulgariaTrips.docs.map(mapTrip), ...bulgariaPrograms.docs.map(mapProgram)],
      abroadItems: [...abroadTrips.docs.map(mapTrip), ...abroadPrograms.docs.map(mapProgram)],
      individualItems: [...individualTrips.docs.map(mapTrip), ...individualPrograms.docs.map(mapProgram)],
    }
  },
  ['megamenu-data'],
  { tags: ['destinations', 'trips', 'programs', 'megamenu'], revalidate: false },
)

export async function GET() {
  try {
    const data = await getMegamenuData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ bulgaria: [], abroad: [], bulgariaItems: [], abroadItems: [], individualItems: [] })
  }
}
