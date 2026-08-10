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

    // Rides should normally be linked to the trip/program/destination in Payload.
    // Also include admin-created rides with no link yet, so they do not disappear
    // from checkout simply because the admin has not selected the related trip.
    const relation = tripId ? 'trip' : destinationId ? 'destination' : programId ? 'program' : null
    const relationId = tripId ?? destinationId ?? programId
    const where: Where = relation && relationId
      ? {
          and: [
            { status: { equals: 'open' } },
            {
              or: [
                { [relation]: { equals: relationId } },
                { [relation]: { exists: false } },
              ],
            },
          ],
        }
      : { status: { equals: 'open' } }

    const result = await payload.find({
      collection: 'carpool-rides',
      where,
      limit: 50,
      depth: 0,
      overrideAccess: true,
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
