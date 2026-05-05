import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const now = new Date()

  const campaigns = await payload.find({
    collection: 'campaigns',
    where: {
      and: [
        { status: { equals: 'scheduled' } },
        { scheduledAt: { less_than_equal: now.toISOString() } },
      ],
    },
    limit: 5,
  })

  for (const campaign of campaigns.docs) {
    try {
      const template = typeof campaign.template === 'object' ? campaign.template : null
      if (!template) continue

      let subscribers: { email: string; firstName?: string }[] = []

      if (campaign.segment) {
        const segmentResult = await payload.find({
          collection: 'subscribers',
          where: { status: { equals: 'active' } },
          limit: 1000,
        })
        subscribers = segmentResult.docs.map((s) => ({
          email: s.email,
          firstName: s.firstName ?? '',
        }))
      } else {
        const allSubs = await payload.find({
          collection: 'subscribers',
          where: { status: { equals: 'active' } },
          limit: 1000,
        })
        subscribers = allSubs.docs.map((s) => ({
          email: s.email,
          firstName: s.firstName ?? '',
        }))
      }

      if (subscribers.length > 0) {
        const batchEmails = subscribers.map((sub) => ({
          from: `Panic Frame <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
          to: sub.email,
          subject: template.subject,
          html: `<p>Здравей, ${sub.firstName ?? 'приключенец'}!</p>`,
        }))

        const BATCH_SIZE = 100
        for (let i = 0; i < batchEmails.length; i += BATCH_SIZE) {
          await resend.batch.send(batchEmails.slice(i, i + BATCH_SIZE))
        }
      }

      await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: {
          status: 'sent',
          sentAt: now.toISOString(),
          stats: {
            sent: subscribers.length,
            opens: 0,
            bounces: 0,
            unsubscribes: 0,
          },
        },
      })
    } catch (err) {
      console.error(`Campaign ${campaign.id} failed:`, err)
      await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'failed' },
      })
    }
  }

  return NextResponse.json({ processed: campaigns.docs.length })
}
