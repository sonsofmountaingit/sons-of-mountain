import { NextRequest, NextResponse } from 'next/server'
import { runSendRegistrationForms } from '@/lib/cron/send-registration-forms'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runSendRegistrationForms()
  return NextResponse.json(result)
}
