import { NextRequest, NextResponse } from 'next/server'
import { runBalanceCharges } from '@/lib/cron/balance-charge'
import { runBalanceReminders } from '@/lib/cron/balance-reminders'

// Called by system cron or Hetzner scheduled task daily
// Secure with CRON_SECRET header
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await Promise.allSettled([runBalanceCharges(), runBalanceReminders()])
  return NextResponse.json({ ok: true })
}
