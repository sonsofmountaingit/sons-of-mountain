import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { releaseCancelledCheckoutPromotions } from '@/lib/checkout-promotions'
import { runBalanceCharges } from '@/lib/cron/balance-charge'
import { runBalanceOverdue } from '@/lib/cron/balance-overdue'
import { runBalanceReminders } from '@/lib/cron/balance-reminders'
import { runGracePeriodCheck } from '@/lib/cron/grace-period'
import { runVoucherDelivery } from '@/lib/cron/voucher-delivery'
import { expirePendingOrders } from '@/lib/cron/expire-pending-orders'
import { retryFailedOrderConfirmations } from '@/lib/cron/delayed-emails'

// Daily due-date maintenance. Keep this separate from Stripe webhook recovery.
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await runBalanceCharges()
  await releaseCancelledCheckoutPromotions(await getPayload({ config })).catch((error) => {
    console.error('[payment-maintenance] Promotion reservation cleanup failed:', error)
  })
  const results = await Promise.allSettled([
    expirePendingOrders(),
    runBalanceOverdue(),
    runBalanceReminders(),
    runGracePeriodCheck(),
    runVoucherDelivery(),
    retryFailedOrderConfirmations(),
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
      name: ['expirePendingOrders', 'runBalanceOverdue', 'runBalanceReminders', 'runGracePeriodCheck', 'runVoucherDelivery', 'retryFailedOrderConfirmations'][i],
      status: r.status,
      reason: r.status === 'rejected' ? String(r.reason?.message || r.reason) : undefined,
    })),
  })
}
