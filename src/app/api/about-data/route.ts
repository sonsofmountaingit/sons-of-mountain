import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const d = (await payload.findGlobal({ slug: 'about', depth: 2 })) as any

    const heroImageUrl = mediaUrl(
      typeof d?.heroImage === 'object' ? d?.heroImage?.url : null
    )
    const whoImage1Url = mediaUrl(
      typeof d?.whoImage1 === 'object' ? d?.whoImage1?.url : null
    )
    const whoImage2Url = mediaUrl(
      typeof d?.whoImage2 === 'object' ? d?.whoImage2?.url : null
    )

    const partners = (d?.partners ?? []).map((p: any) => ({
      name: p.name ?? '',
      url: p.url ?? '',
      logoUrl: mediaUrl(typeof p.logo === 'object' ? p.logo?.url : null),
    }))

    return NextResponse.json({
      ...d,
      heroImageUrl,
      whoImage1Url,
      whoImage2Url,
      partners,
    })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
