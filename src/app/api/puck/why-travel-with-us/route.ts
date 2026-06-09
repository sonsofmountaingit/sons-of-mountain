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
  const block = get('WhyTravelWithUsBlock')

  const updateData: Record<string, unknown> = { puckData }
  if (block.heading !== undefined) updateData.heading = block.heading
  if (block.items !== undefined) updateData.items = block.items

  await payload.updateGlobal({ slug: 'why-travel-with-us', data: updateData, overrideAccess: true }).catch(() => {})
  ;(revalidateTag as any)('why-travel-with-us', 'max')

  return Response.json({ ok: true })
}
