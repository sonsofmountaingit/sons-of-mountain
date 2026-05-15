import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'

const getMegamenuData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const [bulgariaDests, abroadDests, trips] = await Promise.all([
      payload.find({
        collection: 'destinations',
        where: { type: { equals: 'bulgaria' } },
        limit: 20,
        select: { name: true, slug: true, heroImage: true },
        depth: 1,
      }),
      payload.find({
        collection: 'destinations',
        where: { type: { equals: 'abroad' } },
        limit: 20,
        select: { name: true, slug: true, heroImage: true },
        depth: 1,
      }),
      payload.find({
        collection: 'trips',
        where: { status: { equals: 'active' } },
        limit: 20,
        select: { title: true, destination: true, startDate: true, spotsAvailable: true, price: true, currency: true },
        depth: 1,
      }),
    ])

    return {
      bulgaria: bulgariaDests.docs.map((d: any) => ({
        name: d.name as string,
        slug: d.slug as string,
        image: (typeof d.heroImage === 'object' ? d.heroImage?.url : null) as string | null,
      })),
      abroad: abroadDests.docs.map((d: any) => ({
        name: d.name as string,
        slug: d.slug as string,
        image: (typeof d.heroImage === 'object' ? d.heroImage?.url : null) as string | null,
      })),
      trips: trips.docs.map((t: any) => ({
        title: t.title as string,
        destinationSlug: (typeof t.destination === 'object' ? t.destination?.slug : t.destination) as string,
        destinationName: (typeof t.destination === 'object' ? t.destination?.name : '') as string,
        startDate: t.startDate as string,
        spotsAvailable: t.spotsAvailable as number,
        price: t.price as number,
        currency: t.currency as string,
      })),
    }
  },
  ['megamenu-data'],
  { tags: ['destinations', 'trips'], revalidate: 3600 },
)

export async function GET() {
  try {
    const data = await getMegamenuData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ bulgaria: [], abroad: [], trips: [] })
  }
}
