import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderEmail, substituteMergeTags, type EmailTemplateDoc, type EmailSettingsDoc } from '@/lib/email-renderer'
import { buildFeaturedContext, buildAutoContext } from '@/lib/featured-content'

type CampaignDoc = {
  template: string | EmailTemplateDoc
  testEmail?: string | null
  fromName?: string | null
  fromEmail?: string | null
  featuredTrips?: (string | { id: string })[] | null
  featuredPrograms?: (string | { id: string })[] | null
  featuredDestinations?: (string | { id: string })[] | null
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const campaign = (await payload.findByID({ collection: 'campaigns', id, depth: 1 }).catch(() => null)) as CampaignDoc | null
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!campaign.testEmail) return NextResponse.json({ error: 'No testEmail set on campaign' }, { status: 400 })

  const template = typeof campaign.template === 'object'
    ? campaign.template
    : ((await payload.findByID({ collection: 'email-templates', id: campaign.template })) as unknown as EmailTemplateDoc)
  const settings = (await payload.findGlobal({ slug: 'email-settings' })) as EmailSettingsDoc
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'

  const [featuredContext, autoContext] = await Promise.all([
    buildFeaturedContext(payload, {
      featuredTrips: campaign.featuredTrips,
      featuredPrograms: campaign.featuredPrograms,
      featuredDestinations: campaign.featuredDestinations,
    }),
    buildAutoContext(payload),
  ])

  const context = {
    firstName: 'Test',
    lastName: 'User',
    email: campaign.testEmail,
    siteUrl,
    siteName: 'Sons of Mountains',
    currentYear: new Date().getFullYear(),
    unsubscribe_url: '#',
    ...autoContext,
    ...featuredContext,
  }

  const subject = substituteMergeTags(template.subject, context)
  const { html } = await renderEmail(template, context, settings, true)

  const fromName = campaign.fromName || settings.fromName || 'Sons of Mountains'
  const fromEmail = campaign.fromEmail || settings.fromEmail
  const from = fromEmail ? `${fromName} <${fromEmail}>` : fromName

  const { getResend } = await import('@/lib/resend')
  await getResend().emails.send({ from, to: campaign.testEmail, subject: `[TEST] ${subject}`, html })

  return NextResponse.json({ ok: true, subject })
}
