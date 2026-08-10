import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { amount, buyerName, buyerEmail, recipientName, message, preferredDestinations } = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

    if (!amount || !buyerName || !buyerEmail || !recipientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: `Sons of Mountains <${process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'}>`,
      to: process.env.ADMIN_NOTIFICATION_EMAIL ?? 'office@sonsofmountain.com',
      subject: `Нова поръчка на ваучер — ${buyerName}`,
      html: `
        <p><strong>От:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>За:</strong> ${recipientName}</p>
        <p><strong>Стойност:</strong> €${amount}</p>
        ${preferredDestinations ? `<p><strong>Предпочитани дестинации:</strong> ${preferredDestinations}</p>` : ''}
        ${message ? `<p><strong>Съобщение:</strong> ${message}</p>` : ''}
      `,
    })

    await resend.emails.send({
      from: `Sons of Mountains <${process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'}>`,
      to: buyerEmail,
      subject: 'Заявката ти за ваучер е получена — Sons of Mountains',
      html: `
        <p>Здравей, ${buyerName}!</p>
        <p>Получихме заявката ти за подаръчен ваучер на стойност <strong>€${amount}</strong></p>
        <p>Ще се свържем с теб с банкова информация за плащане.</p>
        <br/>
        <p>С уважение,<br/>Sons of Mountains</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Gift voucher error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
