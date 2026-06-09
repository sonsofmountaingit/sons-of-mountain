import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(request: Request) {
  if (!(await verifyPayloadJWT())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = await getPayload({ config })

  let body: { puckData?: any }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const puckData = body.puckData
  const content: any[] = puckData?.content ?? []
  const get = (type: string) => content.find((b: any) => b.type === type)?.props ?? {}

  const linksBlock = get('NavigationLinksBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(linksBlock.navLinksLeft !== undefined && { navLinksLeft: linksBlock.navLinksLeft }),
    ...(linksBlock.navLinksRight !== undefined && { navLinksRight: linksBlock.navLinksRight }),
    ...(linksBlock.instagramUrl !== undefined && { instagramUrl: linksBlock.instagramUrl }),
    ...(linksBlock.facebookUrl !== undefined && { facebookUrl: linksBlock.facebookUrl }),
    ...(linksBlock.tiktokUrl !== undefined && { tiktokUrl: linksBlock.tiktokUrl }),
  }

  await payload.updateGlobal({
    slug: 'navigation',
    data: updateData,
    overrideAccess: true,
  }).catch(() => {})

  ;(revalidateTag as any)('navigation', 'max')
  return Response.json({ ok: true })
}
