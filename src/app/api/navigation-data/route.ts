import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'navigation', depth: 2 })
    const d = data as any
    return NextResponse.json({
      navLinksLeft: d?.navLinksLeft ?? [],
      navLinksRight: d?.navLinksRight ?? [],
      instagramUrl: d?.instagramUrl ?? '',
      facebookUrl: d?.facebookUrl ?? '',
      tiktokUrl: d?.tiktokUrl ?? '',
      logoDark: typeof d?.logoDark === 'object' ? d.logoDark?.url ?? null : null,
      logoLight: typeof d?.logoLight === 'object' ? d.logoLight?.url ?? null : null,
    })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
