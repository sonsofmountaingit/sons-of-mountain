import { NextRequest, NextResponse } from 'next/server'
import { runSubscriptionRenewal } from '@/lib/cron/subscription-renewal'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runSubscriptionRenewal()
  return NextResponse.json({ ok: true })
}
