import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { recipientEmail, context } = body as { recipientEmail?: string; context?: Record<string, string> }
  if (!recipientEmail) return NextResponse.json({ error: 'recipientEmail required' }, { status: 400 })

  const flow = await payload.findByID({ collection: 'email-flows', id }).catch(() => null)
  if (!flow) return NextResponse.json({ error: 'Flow not found' }, { status: 404 })

  const trigger = (flow as any).trigger === 'custom' ? `custom:${(flow as any).customTriggerKey}` : (flow as any).trigger
  const result = await sendFlow(trigger, { email: recipientEmail }, context ?? {}, payload, { skipDuplicateCheck: true })

  if (!result.sent) return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 })

  const log = result.logId ? await payload.findByID({ collection: 'email-logs', id: result.logId }).catch(() => null) : null
  return NextResponse.json({ ok: true, subject: (log as any)?.subject, logId: result.logId })
}
