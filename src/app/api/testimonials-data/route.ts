import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const [section, { docs }] = await Promise.all([
      payload.findGlobal({ slug: 'testimonials-section' }),
      payload.find({ collection: 'testimonials', limit: 100, depth: 1 }),
    ])

    const topRow = docs.filter((d: any) => d.row === 'top')
    const bottomRow = docs.filter((d: any) => d.row === 'bottom')

    return NextResponse.json({ section, topRow, bottomRow })
  } catch {
    return NextResponse.json({ section: {}, topRow: [], bottomRow: [] }, { status: 500 })
  }
}
