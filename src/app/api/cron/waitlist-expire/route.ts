import { NextRequest, NextResponse } from 'next/server'
import { runWaitlistExpire } from '@/lib/cron/waitlist-expire'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runWaitlistExpire()
  return NextResponse.json({ ok: true })
}
