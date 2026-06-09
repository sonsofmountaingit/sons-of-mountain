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
  const cta = get('CalendarCtaBlock')

  await payload.updateGlobal({
    slug: 'calendar-cta',
    data: {
      puckData,
      ...(cta.heading !== undefined && { heading: cta.heading }),
      ...(cta.subheading !== undefined && { subheading: cta.subheading }),
      ...(cta.buttonText !== undefined && { buttonText: cta.buttonText }),
      ...(cta.buttonUrl !== undefined && { buttonUrl: cta.buttonUrl }),
    },
    overrideAccess: true,
  }).catch(() => {})

  ;(revalidateTag as any)('calendar-cta', 'max')
  return Response.json({ ok: true })
}
