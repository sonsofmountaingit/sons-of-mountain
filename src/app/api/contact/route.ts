import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/escape-html'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const safeName = escapeHtml(String(name))
    const safeEmail = escapeHtml(String(email))
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br/>')

    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
    await resend.emails.send({
      from: `Panic Frame Contact <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
      to: process.env.RESEND_FROM_EMAIL ?? 'info@panicframe.com',
      replyTo: String(email),
      subject: `Ново съобщение от ${safeName}`,
      html: `
        <p><strong>От:</strong> ${safeName} (${safeEmail})</p>
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
