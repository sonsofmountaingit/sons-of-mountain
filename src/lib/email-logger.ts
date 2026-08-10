import type { BasePayload } from 'payload'

export type EmailLogStatus = 'queued' | 'sent' | 'delivered' | 'delayed' | 'failed' | 'suppressed' | 'bounced' | 'complained' | 'opened' | 'clicked'

export async function createEmailLog(
  payload: BasePayload,
  data: {
    flow?: string
    campaign?: string
    trigger: string
    recipient: string
    subject: string
    status: EmailLogStatus
    scheduledFor?: string
    resendMessageId?: string
    sentAt?: string
    error?: string
    html?: string
    context?: Record<string, unknown>
  },
): Promise<string> {
  const log = await payload.create({ collection: 'email-logs', data: data as any })
  return String(log.id)
}
