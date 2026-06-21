import { NextRequest, NextResponse } from 'next/server'
import { processAbandonedCarts } from '@/lib/cron/abandoned-cart'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await processAbandonedCarts()
  return NextResponse.json({ ok: true })
}
