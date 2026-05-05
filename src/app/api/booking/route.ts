import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tripId, firstName, lastName, email, phone, participantCount, dietaryNotes, questions, agreedToTerms } = body

    if (!tripId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!agreedToTerms) {
      return NextResponse.json({ error: 'Must agree to terms' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const trip = await payload.findByID({ collection: 'trips', id: tripId })
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        trip: tripId,
        status: 'pending',
        firstName,
        lastName,
        email,
        phone,
        participantCount: participantCount ?? 1,
        dietaryNotes: dietaryNotes ?? '',
        questions: questions ?? '',
        agreedToTerms: true,
        totalAmount: trip.price * (participantCount ?? 1),
        currency: trip.currency,
      },
    })

    await resend.emails.send({
      from: `Panic Frame <${process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'}>`,
      to: email,
      subject: 'Заявката ти е получена — Panic Frame',
      html: `
        <p>Здравей, ${firstName}!</p>
        <p>Получихме заявката ти за пътуване. Ще се свържем с теб в рамките на 24 часа.</p>
        <p>Номер на заявката: <strong>${order.id}</strong></p>
        <br/>
        <p>С уважение,<br/>Panic Frame</p>
      `,
    })

    return NextResponse.json({ ok: true, orderId: order.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
