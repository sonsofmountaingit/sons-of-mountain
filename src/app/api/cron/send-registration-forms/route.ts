import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/escape-html'

const MS_PER_DAY = 86400000

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'
  const now = new Date()

  const { docs: registrations } = await payload.find({
    collection: 'registrations',
    where: {
      and: [
        { registrationFormSentAt: { equals: null } },
        { status: { not_in: ['cancelled', 'refunded'] } },
      ],
    },
    depth: 1,
    limit: 500,
    overrideAccess: true,
  })

  let sent = 0
  let skipped = 0

  for (const registration of registrations) {
    try {
      const destination = typeof registration.destination === 'object' ? registration.destination : null
      const trip = typeof registration.trip === 'object' ? registration.trip : null
      const destinationId = destination?.id ?? (typeof registration.destination === 'number' ? registration.destination : null)
      const tripId = trip?.id ?? (typeof registration.trip === 'number' ? registration.trip : null)
      if (!destinationId && !tripId) { skipped++; continue }

      const { docs: forms } = await payload.find({
        collection: 'registration-forms',
        where: {
          and: [
            { active: { equals: true } },
            {
              or: [
                ...(destinationId ? [{ destination: { equals: destinationId } }] : []),
                ...(tripId ? [{ trip: { equals: tripId } }] : []),
              ],
            },
          ],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const form = forms[0]
      if (!form) { skipped++; continue }

      const startDateRaw = (destination?.startDate as string | null) ?? (trip?.startDate as string | null) ?? null
      const createdAt = new Date(registration.createdAt as string)
      const readyAfterSignup = new Date(createdAt.getTime() + (form.sendAfterDays ?? 5) * MS_PER_DAY)

      if (now < readyAfterSignup) { skipped++; continue }

      if (startDateRaw) {
        const startDate = new Date(startDateRaw)
        const daysUntilStart = (startDate.getTime() - now.getTime()) / MS_PER_DAY
        const minDays = form.sendBeforeDaysMin ?? 30
        if (daysUntilStart < minDays) { skipped++; continue }
      }
      // No start date known yet: held until one is set (still passes the sendAfterDays check above).

      const formUrl = `${siteUrl}/formular/${registration.registrationFormToken}`
      const itemTitle = destination?.name ?? trip?.title ?? 'твоето пътуване'
      const recipientName = escapeHtml(String(registration.firstName ?? ''))
      const safeItemTitle = escapeHtml(String(itemTitle))
      const safeFormTitle = escapeHtml(String(form.title))
      const safeIntro = form.emailIntro ? escapeHtml(String(form.emailIntro)) : `Моля, попълни формуляра за записване за ${safeItemTitle}.`

      await resend.emails.send({
        from: `Sons of Mountains <${fromEmail}>`,
        to: registration.email as string,
        subject: form.emailSubject || 'Формуляр за записване',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="font-size: 22px;">${safeFormTitle}</h1>
            <p>Здравей, ${recipientName}!</p>
            <p>${safeIntro}</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${formUrl}" style="display: inline-block; padding: 14px 28px; background: #1a1a1a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Попълни формуляра
              </a>
            </div>
            <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px;">
              Получаваш този имейл, защото си записан за ${safeItemTitle} в Sons of Mountains.
            </p>
          </div>
        `,
      })

      await payload.update({
        collection: 'registrations',
        id: registration.id,
        data: { registrationFormSentAt: now.toISOString() },
        overrideAccess: true,
      })
      sent++
    } catch (err) {
      console.error(`Registration ${registration.id} form email failed:`, err)
    }
  }

  return NextResponse.json({ processed: registrations.length, sent, skipped })
}
