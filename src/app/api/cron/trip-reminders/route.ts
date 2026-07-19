import { NextRequest, NextResponse } from 'next/server'
import { runTripReminders } from '@/lib/cron/trip-reminders'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runTripReminders()
  return NextResponse.json({ ok: true })
}
