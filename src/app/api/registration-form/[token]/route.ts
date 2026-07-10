import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'registrations',
    where: { registrationFormToken: { equals: token } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const registration = docs[0]
  if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const destinationId = typeof registration.destination === 'object' ? registration.destination?.id : registration.destination
  const tripId = typeof registration.trip === 'object' ? registration.trip?.id : registration.trip

  const { docs: forms } = await payload.find({
    collection: 'registration-forms',
    where: {
      and: [
        { active: { equals: true } },
        {
          or: [
            ...(destinationId ? [{ destination: { equals: destinationId } }] : []),
            ...(tripId ? [{ trip: { equals: tripId } }] : []),
          ],
        },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const form = forms[0]
  if (!form) return NextResponse.json({ error: 'No form configured' }, { status: 404 })

  const { docs: existingSubmissions } = await payload.find({
    collection: 'form-submissions',
    where: { registration: { equals: registration.id }, registrationForm: { equals: form.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  return NextResponse.json({
    form: {
      id: form.id,
      title: form.title,
      emailIntro: form.emailIntro,
      fields: form.fields ?? [],
    },
    registrant: { firstName: registration.firstName, lastName: registration.lastName, email: registration.email },
    alreadySubmitted: existingSubmissions.length > 0,
  })
}
