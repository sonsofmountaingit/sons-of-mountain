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
  const block = get('WhyTravelWithUsBlock')

  const updateData: Record<string, unknown> = { puckData }
  if (block.heading !== undefined) updateData.heading = block.heading
  if (block.items !== undefined) updateData.items = block.items

  await payload.updateGlobal({ slug: 'why-travel-with-us', data: updateData, overrideAccess: true })
  revalidateTag('why-travel-with-us')

  return Response.json({ ok: true })
}
