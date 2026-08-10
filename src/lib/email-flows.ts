import type { BasePayload } from 'payload'
import { substituteMergeTags, renderEmail, type EmailTemplateDoc, type EmailSettingsDoc } from '@/lib/email-renderer'
import { createEmailLog } from '@/lib/email-logger'
import { buildFeaturedContext, buildAutoContext } from '@/lib/featured-content'

export type SendFlowResult = { sent: boolean; logId?: string; reason?: string }

export async function sendFlow(
  trigger: string,
  recipient: { email: string; firstName?: string; lastName?: string },
  context: Record<string, unknown>,
  payload: BasePayload,
  opts?: { skipDuplicateCheck?: boolean },
): Promise<SendFlowResult> {
  const where = trigger.startsWith('custom:')
    ? { and: [{ trigger: { equals: 'custom' } }, { customTriggerKey: { equals: trigger.slice(7) } }, { enabled: { equals: true } }] }
    : { and: [{ trigger: { equals: trigger } }, { enabled: { equals: true } }] }

  const flows = await payload.find({ collection: 'email-flows', where: where as any, limit: 1 })
  const flow = flows.docs[0] as any
  if (!flow) return { sent: false, reason: 'no_flow' }

  if (!opts?.skipDuplicateCheck && flow.skipIfAlreadySent) {
    const existing = await payload.find({
      collection: 'email-logs',
      where: {
        and: [
          { trigger: { equals: trigger } },
          { recipient: { equals: recipient.email } },
          { status: { in: ['sent', 'queued'] } },
        ],
      },
      limit: 1,
    })
    if (existing.docs.length > 0) return { sent: false, reason: 'duplicate' }
  }

  const settings = (await payload.findGlobal({ slug: 'email-settings' })) as EmailSettingsDoc
  const fromName = flow.fromName || settings.fromName || 'Sons of Mountains'
  const fromEmail = flow.fromEmail || settings.fromEmail
  const replyTo = flow.replyTo || settings.replyToEmail || undefined
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'

  let toEmail = recipient.email
  if (settings.testMode && settings.testEmail) toEmail = settings.testEmail

  const [featuredContext, autoContext] = await Promise.all([
    buildFeaturedContext(payload, {
      featuredTrips: flow.featuredTrips,
      featuredPrograms: flow.featuredPrograms,
      featuredDestinations: flow.featuredDestinations,
    }),
    buildAutoContext(payload),
  ])

  const fullContext: Record<string, unknown> = {
    firstName: recipient.firstName ?? '',
    lastName: recipient.lastName ?? '',
    email: recipient.email,
    siteUrl,
    siteName: 'Sons of Mountains',
    currentYear: new Date().getFullYear(),
    ...autoContext,
    ...featuredContext,
    ...context,
  }

  if (!flow.template) return { sent: false, reason: 'no_template' }
  const template = (await payload.findByID({ collection: 'email-templates', id: typeof flow.template === 'string' ? flow.template : flow.template.id })) as unknown as EmailTemplateDoc
  if (!template) return { sent: false, reason: 'no_template' }

  const subjectSource = flow.subjectOverride || template.subject
  const subject = substituteMergeTags(subjectSource, fullContext)
  const { html } = await renderEmail(template, fullContext, settings)

  if (flow.delayMinutes > 0) {
    const scheduledFor = new Date(Date.now() + flow.delayMinutes * 60_000).toISOString()
    const logId = await createEmailLog(payload, {
      flow: flow.id,
      trigger,
      recipient: toEmail,
      subject,
      status: 'queued',
      scheduledFor,
      context: fullContext,
    })
    return { sent: false, logId, reason: 'queued' }
  }

  // Resend tag values may only contain [a-zA-Z0-9_-] — custom triggers use "custom:key" which
  // would otherwise fail the send outright.
  const safeTagValue = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, '_')
  const resendTags = [
    { name: 'trigger', value: safeTagValue(trigger) },
    { name: 'flowId', value: safeTagValue(String(flow.id)) },
    ...((flow.resendTags ?? []) as { name: string; value: string }[]).map((t) => ({ name: t.name, value: safeTagValue(t.value) })),
  ]

  try {
    const { getResend } = await import('@/lib/resend')
    const from = fromEmail ? `${fromName} <${fromEmail}>` : fromName
    const result = await getResend().emails.send({
      from,
      to: toEmail,
      replyTo,
      subject,
      html,
      tags: resendTags,
    })

    if (flow.ccAdmin && settings.adminEmail) {
      await getResend().emails.send({ from, to: settings.adminEmail, replyTo, subject, html, tags: resendTags }).catch(() => {})
    }

    const logId = await createEmailLog(payload, {
      flow: flow.id,
      trigger,
      recipient: toEmail,
      subject,
      status: 'sent',
      resendMessageId: result.data?.id,
      sentAt: new Date().toISOString(),
      html,
      context: fullContext,
    })

    await payload.update({
      collection: 'email-flows',
      id: flow.id,
      data: { lastTriggeredAt: new Date().toISOString(), totalSent: (flow.totalSent ?? 0) + 1 },
    })

    const subs = await payload.find({ collection: 'subscribers', where: { email: { equals: recipient.email } }, limit: 1 })
    if (subs.docs[0]) {
      await payload.update({
        collection: 'subscribers',
        id: subs.docs[0].id,
        data: { lastEmailSentAt: new Date().toISOString(), emailCount: ((subs.docs[0] as any).emailCount ?? 0) + 1 },
      })
    }

    return { sent: true, logId }
  } catch (err) {
    await createEmailLog(payload, {
      flow: flow.id,
      trigger,
      recipient: toEmail,
      subject,
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
      context: fullContext,
    })
    throw err
  }
}
