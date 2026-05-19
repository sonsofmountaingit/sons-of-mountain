import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { puckData } = await req.json()
  const payload = await getPayload({ config })
  await payload.updateGlobal({ slug: 'shop', data: { puckData } })
  revalidateTag('shop', 'default')
  return NextResponse.json({ ok: true })
}
