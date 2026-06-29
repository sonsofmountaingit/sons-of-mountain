import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get('tripId')
    const destinationId = searchParams.get('destinationId')
    const programId = searchParams.get('programId')

    const payload = await getPayload({ config })

    const where: Where = { status: { equals: 'open' } }
    if (tripId) where['trip'] = { equals: tripId }
    else if (destinationId) where['destination'] = { equals: destinationId }
    else if (programId) where['program'] = { equals: programId }

    const result = await payload.find({
      collection: 'carpool-rides',
      where,
      limit: 50,
      depth: 0,
    })

    const rides = result.docs.map((r: any) => ({
      id: r.id,
      vehicleType: r.vehicleType,
      seatsAvailable: r.seatsAvailable,
      departureFrom: r.departureFrom,
      departureTime: r.departureTime ?? null,
      organizerName: r.organizerName,
      passengersCount: (r.passengers ?? []).length,
    }))

    return NextResponse.json({ rides })
  } catch (err) {
    console.error('Carpool rides error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Called from checkout when participationType === 'organizer'
// Creates a new carpool-rides doc and returns its id
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vehicleType, seatsAvailable, departureFrom, departureTime, notes, organizerName, organizerEmail, organizerPhone, tripId, programId } = body

    if (!vehicleType || !seatsAvailable || !departureFrom) {
      return NextResponse.json({ error: 'Missing required carpool fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const ride = await payload.create({
      collection: 'carpool-rides',
      data: {
        vehicleType,
        seatsAvailable,
        departureFrom,
        departureTime: departureTime ?? null,
        notes: notes ?? null,
        organizerName: organizerName ?? null,
        organizerEmail: organizerEmail ?? null,
        organizerPhone: organizerPhone ?? null,
        trip: tripId ?? null,
        program: programId ?? null,
        status: 'open',
        source: 'registration',
      } as any,
    })

    return NextResponse.json({ id: ride.id })
  } catch (err) {
    console.error('Carpool ride create error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
