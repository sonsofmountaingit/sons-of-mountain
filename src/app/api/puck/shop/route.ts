import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(req: NextRequest) {
  if (!(await verifyPayloadJWT())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { puckData } = await req.json()
  const payload = await getPayload({ config })
  await payload.updateGlobal({ slug: 'shop', data: { puckData }, overrideAccess: true }).catch(() => {})
  ;(revalidateTag as any)('shop', 'max')
  return NextResponse.json({ ok: true })
}
