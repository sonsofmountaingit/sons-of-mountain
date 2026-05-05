import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { puckData?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // overrideAccess: true skips field validation — we only care about puckData,
  // not the legacy layout field which may have stale invalid references
  await payload.update({
    collection: 'pages',
    id,
    data: { puckData: body.puckData ?? null },
    draft: true,
    overrideAccess: true,
  })

  return Response.json({ ok: true })
}
