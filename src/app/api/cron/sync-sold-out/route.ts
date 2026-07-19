import { NextRequest, NextResponse } from 'next/server'
import { runSyncSoldOut } from '@/lib/cron/sync-sold-out'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runSyncSoldOut()
  return NextResponse.json(result)
}
