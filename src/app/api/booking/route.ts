import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
    const { tripId, destinationId, firstName, lastName, email, phone, participantCount, dietaryNotes, questions, agreedToTerms } = body

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!agreedToTerms) {
      return NextResponse.json({ error: 'Must agree to terms' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const session = await auth.api.getSession({ headers: req.headers })

    let totalAmount = 0
    let currency = 'EUR'

    if (tripId) {
      const trip = await payload.findByID({ collection: 'trips', id: tripId })
      if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
      totalAmount = (trip.price ?? 0) * (participantCount ?? 1)
      currency = trip.currency ?? 'EUR'
    }

    // Resolve customer record if authenticated
    let customerId: string | undefined
    let customerDocId: string | undefined
    if (session?.user?.id) {
      customerId = session.user.id
      const existing = await payload.find({
        collection: 'customers',
        where: { betterAuthId: { equals: customerId } },
        limit: 1,
      })
      customerDocId = existing.docs[0]?.id as string | undefined
    }

    const registration = await payload.create({
      collection: 'registrations',
      data: {
        ...(customerId ? { betterAuthUserId: customerId } : {}),
        ...(customerDocId ? { customer: customerDocId } : {}),
        ...(tripId ? { trip: tripId } : {}),
        ...(destinationId ? { destination: destinationId } : {}),
        status: 'pending',
        firstName,
        lastName,
        email,
        phone,
        participantCount: participantCount ?? 1,
        dietaryNotes: dietaryNotes ?? '',
        questions: questions ?? '',
        agreedToTerms: true,
        totalAmount,
        currency,
      },
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
      to: email,
      subject: 'Заявката ти е получена — Sons of Mountains',
      html: `
        <p>Здравей, ${firstName}!</p>
        <p>Получихме заявката ти за пътуване. Ще се свържем с теб в рамките на 24 часа.</p>
        <p>Номер на заявката: <strong>${registration.id}</strong></p>
        <br/>
        <p>С уважение,<br/>Sons of Mountains</p>
      `,
    })

    return NextResponse.json({ ok: true, registrationId: registration.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
