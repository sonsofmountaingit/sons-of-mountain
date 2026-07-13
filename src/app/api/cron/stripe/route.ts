import { NextRequest, NextResponse } from 'next/server'
import { runBalanceCharges } from '@/lib/cron/balance-charge'
import { runBalanceReminders } from '@/lib/cron/balance-reminders'
import { runGracePeriodCheck } from '@/lib/cron/grace-period'

// Called by system cron or Hetzner scheduled task daily
// Secure with CRON_SECRET via Bearer token
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Charges must run before grace-period check so today's failures are visible immediately;
  // reminders are independent and run in parallel.
  await runBalanceCharges()
  await Promise.allSettled([runBalanceReminders(), runGracePeriodCheck()])
  return NextResponse.json({ ok: true })
}
