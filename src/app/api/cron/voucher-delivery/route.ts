import { NextRequest, NextResponse } from 'next/server'
import { runVoucherDelivery } from '@/lib/cron/voucher-delivery'

// Invoked automatically by the server's minute-level scheduler. It is separate
// from configurable admin cron jobs because gift delivery is transactional.
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await runVoucherDelivery()
  return NextResponse.json({ ok: true })
}
