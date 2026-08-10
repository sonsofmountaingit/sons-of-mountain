import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { escapeHtml } from '@/lib/escape-html'
import { isRateLimited } from '@/lib/rate-limit'
import { createEmailLog } from '@/lib/email-logger'

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  company: z.string().max(0).optional(),
  answers: z.array(
    z.object({
      question: z.string().trim().min(1).max(300),
      answer: z.string().trim().max(3000),
    }),
  ).max(50),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(`program-inquiry:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { name, email, phone, company, answers } = parsed.data
    if (company) {
      return NextResponse.json({ ok: true })
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = phone ? escapeHtml(phone) : null

    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: 'program-inquiries',
      data: { name, email, phone, answers, ip },
      overrideAccess: true,
    })

    let emailSent = false
    const from = `Sons of Mountains — Индивидуални програми <${process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'}>`
    try {
      const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
      const adminResult = await resend.emails.send({
        from,
        to: process.env.ADMIN_NOTIFICATION_EMAIL ?? 'office@sonsofmountain.com',
        replyTo: email,
        subject: `Ново запитване за индивидуална програма — от ${safeName}`,
        html: `
          <p><strong>От:</strong> ${safeName} (${safeEmail})</p>
          ${safePhone ? `<p><strong>Телефон:</strong> ${safePhone}</p>` : ''}
          <p><strong>Отговори на въпросника:</strong></p>
          <ul>
            ${answers.map((a) => `<li><strong>${escapeHtml(a.question)}:</strong> ${escapeHtml(a.answer).replace(/\n/g, '<br/>')}</li>`).join('')}
          </ul>
        `,
      })
      if (adminResult.error) throw new Error(adminResult.error.message)

      const customerSubject = 'Получихме твоето запитване — Sons of Mountains'
      const customerHtml = `<p>Здравей, ${safeName}!</p><p>Получихме твоето запитване за индивидуална програма. Нашият екип ще го прегледа и ще се свърже с теб съвсем скоро.</p><p>Благодарим ти,<br/>Sons of Mountains</p>`
      const customerResult = await resend.emails.send({
        from,
        to: email,
        replyTo: process.env.ADMIN_NOTIFICATION_EMAIL ?? 'office@sonsofmountain.com',
        subject: customerSubject,
        html: customerHtml,
      })
      if (customerResult.error) throw new Error(customerResult.error.message)
      await createEmailLog(payload, {
        trigger: 'individual_program_inquiry_confirmation',
        recipient: email,
        subject: customerSubject,
        status: 'sent',
        resendMessageId: customerResult.data?.id,
        sentAt: new Date().toISOString(),
        html: customerHtml,
        context: { programInquiryId: String(doc.id) },
      })
      emailSent = true
    } catch (emailErr) {
      await createEmailLog(payload, {
        trigger: 'individual_program_inquiry_confirmation',
        recipient: email,
        subject: 'Получихме твоето запитване — Sons of Mountains',
        status: 'failed',
        error: emailErr instanceof Error ? emailErr.message : String(emailErr),
        context: { programInquiryId: String(doc.id) },
      }).catch(() => {})
      console.error('Program inquiry email error:', emailErr)
    }

    if (emailSent) {
      await payload.update({
        collection: 'program-inquiries',
        id: doc.id,
        data: { emailSent: true },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Program inquiry error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
