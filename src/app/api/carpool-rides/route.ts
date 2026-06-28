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
