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

  const heroMain = get('HeroMainBlock')

  await payload.updateGlobal({
    slug: 'hero',
    data: {
      puckData,
      ...(heroMain.headline !== undefined && { headline: heroMain.headline }),
      ...(heroMain.subtext !== undefined && { subtext: heroMain.subtext }),
      ...(heroMain.ctaLabel !== undefined && { ctaLabel: heroMain.ctaLabel }),
      ...(heroMain.ctaUrl !== undefined && { ctaUrl: heroMain.ctaUrl }),
      ...(heroMain.backgroundImageUrl !== undefined && { backgroundImageUrl: heroMain.backgroundImageUrl }),
    },
    overrideAccess: true,
  })

  revalidateTag('hero', 'default')
  return Response.json({ ok: true })
}
