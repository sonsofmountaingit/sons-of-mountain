import { getPayload } from 'payload'
import config from '@payload-config'
import { renderEmail, type EmailTemplateDoc, type EmailSettingsDoc } from '@/lib/email-renderer'

type EmailFlowDoc = {
  id: string
  template?: string | null
  fromName?: string | null
  fromEmail?: string | null
  totalSent?: number | null
}

export async function runDelayedEmails() {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const logs = await payload.find({
    collection: 'email-logs',
    where: { and: [{ status: { equals: 'queued' } }, { scheduledFor: { less_than_equal: now } }] },
    limit: 100,
  })

  for (const log of logs.docs as any[]) {
    try {
      if (!log.flow) continue
      const flowId = typeof log.flow === 'string' ? log.flow : log.flow.id
      const flow = (await payload.findByID({ collection: 'email-flows', id: flowId }).catch(() => null)) as EmailFlowDoc | null
      if (!flow || !flow.template) continue

      const template = (await payload.findByID({ collection: 'email-templates', id: flow.template })) as unknown as EmailTemplateDoc
      const settings = (await payload.findGlobal({ slug: 'email-settings' })) as EmailSettingsDoc
      const { html } = await renderEmail(template, log.context ?? {}, settings)

      const fromName = flow.fromName || settings.fromName || 'Sons of Mountains'
      const fromEmail = flow.fromEmail || settings.fromEmail
      const from = fromEmail ? `${fromName} <${fromEmail}>` : fromName

      const { getResend } = await import('@/lib/resend')
      const result = await getResend().emails.send({ from, to: log.recipient, subject: log.subject, html })

      await payload.update({
        collection: 'email-logs',
        id: log.id,
        data: { status: 'sent', sentAt: new Date().toISOString(), resendMessageId: result.data?.id },
      })
      await payload.update({
        collection: 'email-flows',
        id: flowId,
        data: { totalSent: (flow.totalSent ?? 0) + 1, lastTriggeredAt: new Date().toISOString() },
      })
    } catch (err) {
      await payload.update({
        collection: 'email-logs',
        id: log.id,
        data: { status: 'failed', error: err instanceof Error ? err.message : String(err) },
      }).catch(() => {})
    }
  }
}
