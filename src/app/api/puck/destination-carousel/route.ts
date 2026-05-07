import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function PATCH(request: Request) {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { puckData?: any }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const puckData = body.puckData
  const content: any[] = puckData?.content ?? []
  const get = (type: string) => content.find((b: any) => b.type === type)?.props ?? {}

  const carouselBlock = get('HomeDestCarouselBlock')

  await payload.updateGlobal({
    slug: 'destination-carousel',
    data: {
      puckData,
      ...(carouselBlock.sectionTitle !== undefined && { sectionTitle: carouselBlock.sectionTitle }),
    },
    overrideAccess: true,
  })

  revalidateTag('destination-carousel', 'default')
  return Response.json({ ok: true })
}
