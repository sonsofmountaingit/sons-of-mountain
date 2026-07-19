import { NextRequest, NextResponse } from 'next/server'
import { runReviewRequests } from '@/lib/cron/review-requests'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runReviewRequests()
  return NextResponse.json({ ok: true })
}
