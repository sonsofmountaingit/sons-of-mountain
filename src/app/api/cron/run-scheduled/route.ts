import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { runDueCronJobs } from '@/lib/cron/dispatcher'

// Single entry point for all admin-configurable scheduled jobs. Call this frequently
// (e.g. every 5-15 minutes) — each job's own intervalMinutes/enabled flag (set in
// Payload admin under Email Marketing > Cron Jobs) decides whether it actually runs.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const result = await runDueCronJobs(payload)
  return NextResponse.json(result)
}
