import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(request: Request) {
  if (!(await verifyPayloadJWT())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = await getPayload({ config })

  let body: { puckData?: any }
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }

  await payload.updateGlobal({ slug: 'home-page', data: { puckData: body.puckData }, overrideAccess: true }).catch(() => {})
  ;(revalidateTag as any)('home-page', 'max')

  return Response.json({ ok: true })
}
