import { NextRequest, NextResponse } from 'next/server'
import { runBalanceOverdue } from '@/lib/cron/balance-overdue'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runBalanceOverdue()
  return NextResponse.json({ ok: true })
}
