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
  const block = get('TermsAndConditionsContentBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(block.title !== undefined && { title: block.title }),
    ...(block.lastUpdated !== undefined && { lastUpdated: block.lastUpdated }),
    ...(block.content !== undefined && { content: block.content }),
  }

  await payload.updateGlobal({ slug: 'terms-and-conditions', data: updateData, overrideAccess: true }).catch(() => {})

  ;(revalidateTag as any)('terms-and-conditions', 'max')
  return Response.json({ ok: true })
}
