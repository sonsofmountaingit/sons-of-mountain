import { getPayload } from 'payload'
import config from '@payload-config'
import { resolveAudience } from '@/lib/segments'
import { renderEmail, substituteMergeTags, type EmailTemplateDoc, type EmailSettingsDoc } from '@/lib/email-renderer'
import { createEmailLog } from '@/lib/email-logger'
import { buildFeaturedContext, buildAutoContext } from '@/lib/featured-content'

type CampaignDoc = {
  id: string
  template: string | EmailTemplateDoc
  segments?: (string | { id: string })[] | null
  audienceType: 'subscribers' | 'customers'
  fromName?: string | null
  fromEmail?: string | null
  featuredTrips?: (string | { id: string })[] | null
  featuredPrograms?: (string | { id: string })[] | null
  featuredDestinations?: (string | { id: string })[] | null
}

export async function runSendCampaigns(): Promise<{ processed: number; total: number }> {
  const payload = await getPayload({ config })
  const now = new Date()

  const campaigns = await payload.find({
    collection: 'campaigns',
    where: { and: [{ status: { equals: 'scheduled' } }, { scheduledAt: { less_than_equal: now.toISOString() } }] },
    limit: 10,
    depth: 2,
  })

  let processed = 0

  for (const campaign of campaigns.docs as unknown as CampaignDoc[]) {
    try {
      await payload.update({ collection: 'campaigns', id: campaign.id, data: { status: 'sending' } })

      const settings = (await payload.findGlobal({ slug: 'email-settings' })) as EmailSettingsDoc
      const template = typeof campaign.template === 'object'
        ? campaign.template
        : ((await payload.findByID({ collection: 'email-templates', id: campaign.template })) as unknown as EmailTemplateDoc)
      const segmentIds = (campaign.segments ?? []).map((s) => (typeof s === 'string' ? s : s.id))
      const recipients = await resolveAudience(segmentIds, campaign.audienceType, payload)

      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'
      const fromName = campaign.fromName || settings.fromName || 'Sons of Mountains'
      const fromEmail = campaign.fromEmail || settings.fromEmail
      const from = fromEmail ? `${fromName} <${fromEmail}>` : fromName

      const [featuredContext, autoContext] = await Promise.all([
        buildFeaturedContext(payload, {
          featuredTrips: campaign.featuredTrips,
          featuredPrograms: campaign.featuredPrograms,
          featuredDestinations: campaign.featuredDestinations,
        }),
        buildAutoContext(payload),
      ])

      const { getResend } = await import('@/lib/resend')
      const messageIds: string[] = []
      const logContexts: { recipient: string; subject: string; context: Record<string, unknown> }[] = []

      const BATCH_SIZE = 100
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const chunk = recipients.slice(i, i + BATCH_SIZE)
        const batchEmails = await Promise.all(
          chunk.map(async (r) => {
            const unsubscribeUrl = r.unsubscribeToken
              ? `${siteUrl}/api/unsubscribe?token=${r.unsubscribeToken}`
              : `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(r.email)}`
            const context = {
              firstName: r.firstName ?? '',
              lastName: r.lastName ?? '',
              email: r.email,
              siteUrl,
              siteName: 'Sons of Mountains',
              currentYear: now.getFullYear(),
              unsubscribe_url: unsubscribeUrl,
              ...autoContext,
              ...featuredContext,
            }
            const subject = substituteMergeTags(template.subject, context)
            const { html } = await renderEmail(template, context, settings, true)
            logContexts.push({ recipient: r.email, subject, context })
            return {
              from,
              to: r.email,
              subject,
              html,
              headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
              tags: [{ name: 'campaignId', value: String(campaign.id) }, { name: 'type', value: 'campaign' }],
            }
          }),
        )
        const results = await getResend().batch.send(batchEmails)
        for (const r of results.data?.data ?? []) if (r?.id) messageIds.push(r.id)
      }

      for (const lc of logContexts) {
        await createEmailLog(payload, {
          campaign: campaign.id,
          trigger: 'campaign',
          recipient: lc.recipient,
          subject: lc.subject,
          status: 'sent',
          sentAt: now.toISOString(),
          context: lc.context,
        })
        const subs = await payload.find({ collection: 'subscribers', where: { email: { equals: lc.recipient } }, limit: 1 })
        if (subs.docs[0]) {
          await payload.update({
            collection: 'subscribers',
            id: subs.docs[0].id,
            data: { lastEmailSentAt: now.toISOString(), emailCount: ((subs.docs[0] as any).emailCount ?? 0) + 1 },
          })
        }
      }

      await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: {
          status: 'sent',
          sentAt: now.toISOString(),
          sentCount: recipients.length,
          resendMessageIds: messageIds.map((id) => ({ id })),
          stats: { sent: recipients.length, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 },
        },
      })
      processed++
    } catch (err) {
      console.error(`Campaign ${campaign.id} failed:`, err)
      await payload.update({ collection: 'campaigns', id: campaign.id, data: { status: 'failed' } })
    }
  }

  return { processed, total: campaigns.docs.length }
}
