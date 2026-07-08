import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getVouchersData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'vouchers', depth: 0 })
    return data
  },
  ['vouchers-data'],
  { tags: ['vouchers'], revalidate: false },
)

export async function GET() {
  try {
    const data = await getVouchersData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
