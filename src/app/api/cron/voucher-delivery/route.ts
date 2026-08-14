import { NextRequest, NextResponse } from 'next/server'
import { runVoucherDelivery } from '@/lib/cron/voucher-delivery'

// Invoked by the daily payment-maintenance job. Delivery is idempotent via
// deliverySentAt, so it remains safe to retry after a transient failure.
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await runVoucherDelivery()
  return NextResponse.json({ ok: true })
}
