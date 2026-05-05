import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { amount, buyerName, buyerEmail, recipientName, message, preferredDestinations } = await req.json()

    if (!amount || !buyerName || !buyerEmail || !recipientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: `Panic Frame <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
      to: process.env.RESEND_FROM_EMAIL ?? 'info@panicframe.com',
      subject: `Нова поръчка на ваучер — ${buyerName}`,
      html: `
        <p><strong>От:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>За:</strong> ${recipientName}</p>
        <p><strong>Стойност:</strong> ${amount} лв.</p>
        ${preferredDestinations ? `<p><strong>Предпочитани дестинации:</strong> ${preferredDestinations}</p>` : ''}
        ${message ? `<p><strong>Съобщение:</strong> ${message}</p>` : ''}
      `,
    })

    await resend.emails.send({
      from: `Panic Frame <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
      to: buyerEmail,
      subject: 'Заявката ти за ваучер е получена — Panic Frame',
      html: `
        <p>Здравей, ${buyerName}!</p>
        <p>Получихме заявката ти за подаръчен ваучер на стойност <strong>${amount} лв.</strong></p>
        <p>Ще се свържем с теб с банкова информация за плащане.</p>
        <br/>
        <p>С уважение,<br/>Panic Frame</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Gift voucher error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
