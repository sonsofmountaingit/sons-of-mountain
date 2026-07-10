import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const d = (await payload.findGlobal({ slug: 'individual-programs-page', depth: 2 })) as any

    const heroImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null)
    const whyImageUrl = mediaUrl(typeof d?.whyImage === 'object' ? d?.whyImage?.url : null)

    return NextResponse.json({
      ...d,
      heroImageUrl,
      whyImageUrl,
    })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
