import { NextRequest, NextResponse } from 'next/server'
import { runDelayedEmails } from '@/lib/cron/delayed-emails'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await runDelayedEmails()
  return NextResponse.json({ ok: true })
}
