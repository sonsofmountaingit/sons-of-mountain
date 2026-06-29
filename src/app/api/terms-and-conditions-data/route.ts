import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })
  const doc = await payload.findGlobal({ slug: 'terms-and-conditions', overrideAccess: true })
  return Response.json(doc)
}
