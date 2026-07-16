import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { resolvePaymentPlan } from '@/lib/pricing/payment-plan'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
    const {
      tripId, destinationId, programId,
      firstName, lastName, email, phone,
      participantCount, dietaryNotes, questions, agreedToTerms,
      carpool, carpoolVehicleType, carpoolSeats, carpoolFrom,
    } = body

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!agreedToTerms) {
      return NextResponse.json({ error: 'Must agree to terms' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    let totalAmount = 0
    let currency = 'EUR'
    let paymentMode = 'full'
    let installments: Array<{ label: string; amount: number; dueDate: string }> = []

    const bookableCollection = tripId ? 'trips' : destinationId ? 'destinations' : programId ? 'programs' : null
    const bookableId = tripId ?? destinationId ?? programId

    if (bookableCollection && bookableId) {
      const doc = await payload.findByID({ collection: bookableCollection, id: bookableId })
      if (!doc) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      totalAmount = ((doc as any).price ?? 0) * (participantCount ?? 1)
      currency = (doc as any).currency ?? 'EUR'

      const plan = resolvePaymentPlan(doc as any, new Date())
      paymentMode = plan.mode === 'installments3' ? 'installments' : plan.mode
      installments = plan.installments.map((inst) => ({
        label: inst.label,
        amount: inst.amount * (participantCount ?? 1),
        dueDate: inst.dueDate.toISOString(),
      }))
    }

    const customerDocId = user?.collection === 'customers' ? (user.id as string) : undefined

    const registration = await payload.create({
      collection: 'registrations',
      data: {
        ...(customerDocId ? { customer: customerDocId } : {}),
        ...(tripId ? { trip: tripId } : {}),
        ...(destinationId ? { destination: destinationId } : {}),
        ...(programId ? { program: programId } : {}),
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
        paymentMode,
        installments: paymentMode === 'installments' || paymentMode === 'deposit' ? installments : undefined,
        remainingBalance: paymentMode === 'deposit' ? installments[1]?.amount : undefined,
        remainingDueDate: paymentMode === 'deposit' ? installments[1]?.dueDate : undefined,
        ...(carpool ? { carpool } : {}),
        ...(carpool === 'organizer' && carpoolVehicleType ? { carpoolVehicleType } : {}),
        ...(carpool === 'organizer' && carpoolSeats ? { carpoolSeats } : {}),
        ...(carpool === 'organizer' && carpoolFrom ? { carpoolFrom } : {}),
      },
    })

    // If organizer — create a CarpoolRide record
    let carpoolRideId: string | undefined
    if (carpool === 'organizer') {
      const ride = await payload.create({
        collection: 'carpool-rides',
        data: {
          source: 'registration',
          status: 'open',
          vehicleType: carpoolVehicleType ?? '',
          seatsAvailable: carpoolSeats ?? 1,
          departureFrom: carpoolFrom ?? '',
          ...(tripId ? { trip: tripId } : {}),
          ...(destinationId ? { destination: destinationId } : {}),
          ...(programId ? { program: programId } : {}),
          organizerRegistration: registration.id,
          organizerName: `${firstName} ${lastName}`,
          organizerEmail: email,
          organizerPhone: phone,
          passengers: [],
        },
      })
      carpoolRideId = ride.id as string
      // Link back registration → ride
      await payload.update({
        collection: 'registrations',
        id: registration.id,
        data: { carpoolRide: carpoolRideId },
      })
    }

    // If passenger — link to chosen ride if provided, add as passenger
    if (carpool === 'passenger' && body.carpoolRideId) {
      const ride = await payload.findByID({ collection: 'carpool-rides', id: body.carpoolRideId })
      if (ride) {
        const existing = (ride.passengers as any[]) ?? []
        await payload.update({
          collection: 'carpool-rides',
          id: body.carpoolRideId,
          data: {
            passengers: [
              ...existing,
              {
                registration: registration.id,
                name: `${firstName} ${lastName}`,
                email,
                phone,
              },
            ],
          },
        })
        await payload.update({
          collection: 'registrations',
          id: registration.id,
          data: { carpoolRide: body.carpoolRideId },
        })
      }
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com',
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

    return NextResponse.json({ ok: true, registrationId: registration.id, ...(carpoolRideId ? { carpoolRideId } : {}) })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
