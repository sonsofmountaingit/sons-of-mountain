import { getPayload } from 'payload'
import config from '@payload-config'
import { renderEmail, type EmailTemplateDoc, type EmailSettingsDoc } from '@/lib/email-renderer'
import { sendOrderConfirmationEmail } from '@/lib/stripe-webhooks'

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

export async function retryFailedOrderConfirmations() {
  const payload = await getPayload({ config })
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const logs = await payload.find({
    collection: 'email-logs',
    where: {
      and: [
        { trigger: { equals: 'order_confirmation' } },
        { status: { equals: 'failed' } },
        { createdAt: { greater_than: cutoff } },
      ],
    },
    limit: 100,
    pagination: false,
    depth: 0,
  })

  let retried = 0
  for (const log of logs.docs as any[]) {
    const orderId = log.context?.orderId
    if (!orderId) continue
    try {
      await sendOrderConfirmationEmail(payload, String(orderId))
      retried++
    } catch (error) {
      console.error(`[email-recovery] Order confirmation retry failed for ${orderId}:`, error)
    }
  }
  return { checked: logs.docs.length, retried }
}
