import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const hero = await payload.findGlobal({ slug: 'hero', depth: 2 })
    return Response.json(hero)
  } catch {
    return Response.json({ error: 'Failed to fetch hero data' }, { status: 500 })
  }
}
