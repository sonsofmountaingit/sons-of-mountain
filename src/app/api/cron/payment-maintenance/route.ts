import { NextRequest, NextResponse } from 'next/server'
import { runBalanceCharges } from '@/lib/cron/balance-charge'
import { runBalanceOverdue } from '@/lib/cron/balance-overdue'
import { runBalanceReminders } from '@/lib/cron/balance-reminders'
import { runGracePeriodCheck } from '@/lib/cron/grace-period'
import { runVoucherDelivery } from '@/lib/cron/voucher-delivery'

// Daily due-date maintenance. Keep this separate from Stripe webhook recovery.
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await runBalanceCharges()
  const results = await Promise.allSettled([
    runBalanceOverdue(),
    runBalanceReminders(),
    runGracePeriodCheck(),
    runVoucherDelivery(),
  ])
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('[payment-maintenance] Job failed:', r.reason)
    }
  }
  const failed = results.filter((result) => result.status === 'rejected').length
  return NextResponse.json({
    ok: failed === 0,
    failed,
    details: results.map((r, i) => ({
      name: ['runBalanceOverdue', 'runBalanceReminders', 'runGracePeriodCheck', 'runVoucherDelivery'][i],
      status: r.status,
      reason: r.status === 'rejected' ? String(r.reason?.message || r.reason) : undefined,
    })),
  })
}
