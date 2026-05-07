import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const carousel = await payload.findGlobal({ slug: 'destination-carousel', depth: 2 })
    const { docs: allDestinations } = await payload.find({
      collection: 'destinations',
      limit: 50,
      sort: 'name',
      depth: 2,
    })
    return Response.json({ carousel, destinations: allDestinations })
  } catch {
    return Response.json({ error: 'Failed to fetch destination carousel data' }, { status: 500 })
  }
}
