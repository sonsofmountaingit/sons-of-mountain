import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(request: Request) {
  if (!(await verifyPayloadJWT())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = await getPayload({ config })

  let body: { puckData?: any }
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const puckData = body.puckData
  const content: any[] = puckData?.content ?? []
  const get = (type: string) => content.find((b: any) => b.type === type)?.props ?? {}

  const hero = get('StoriesHeroBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(hero.heading !== undefined && { heading: hero.heading }),
    ...(hero.subheading !== undefined && { subheading: hero.subheading }),
  }

  await payload.updateGlobal({ slug: 'stories-page', data: updateData, overrideAccess: true }).catch(() => {})
  ;(revalidateTag as any)('stories-page', 'max')

  return Response.json({ ok: true })
}
