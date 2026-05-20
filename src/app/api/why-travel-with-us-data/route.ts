import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'why-travel-with-us', depth: 0 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
