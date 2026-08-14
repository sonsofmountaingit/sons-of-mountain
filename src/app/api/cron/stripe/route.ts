import { NextRequest, NextResponse } from 'next/server'
import { reconcileCheckoutPayments } from '@/lib/cron/reconcile-checkout-payments'

// Lightweight Stripe webhook safety net. All due-date work has dedicated daily
// jobs so this endpoint is safe to call frequently.
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const recovery = await reconcileCheckoutPayments()
  return NextResponse.json({ ok: true, recovery })
}
