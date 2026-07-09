import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { escapeHtml } from '@/lib/escape-html'
import { isRateLimited } from '@/lib/rate-limit'

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  company: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { name, email, message, phone, subject, company } = parsed.data
    if (company) {
      return NextResponse.json({ ok: true })
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
    const safePhone = phone ? escapeHtml(phone) : null
    const safeSubject = subject ? escapeHtml(subject) : null

    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
    await resend.emails.send({
      from: `Sons of Mountains Contact <${process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'}>`,
      to: process.env.RESEND_FROM_EMAIL ?? 'info@sonsofmountain.com',
      replyTo: email,
      subject: safeSubject ? `${safeSubject} — от ${safeName}` : `Ново съобщение от ${safeName}`,
      html: `
        <p><strong>От:</strong> ${safeName} (${safeEmail})</p>
        ${safePhone ? `<p><strong>Телефон:</strong> ${safePhone}</p>` : ''}
        <p><strong>Съобщение:</strong></p>
        <p>${safeMessage}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
