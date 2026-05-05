import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    await resend.emails.send({
      from: `Panic Frame Contact <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
      to: process.env.RESEND_FROM_EMAIL ?? 'info@panicframe.com',
      replyTo: email,
      subject: `Ново съобщение от ${name}`,
      html: `
        <p><strong>От:</strong> ${name} (${email})</p>
        <p><strong>Съобщение:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
