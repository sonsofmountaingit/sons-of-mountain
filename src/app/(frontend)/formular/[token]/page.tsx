import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RegistrationForm } from '@/components/forms/RegistrationForm'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ token: string }> }

export default async function RegistrationFormPage({ params }: Props) {
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
  if (!registration) notFound()

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
  if (!form) notFound()

  const { docs: existingSubmissions } = await payload.find({
    collection: 'form-submissions',
    where: { registration: { equals: registration.id }, registrationForm: { equals: form.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>{form.title}</h1>
      {form.emailIntro && <p style={{ marginBottom: '2rem', color: '#444' }}>{form.emailIntro}</p>}

      {existingSubmissions.length > 0 ? (
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Вече си попълнил този формуляр. Благодарим ти!</p>
      ) : (
        <RegistrationForm
          token={token}
          formId={String(form.id)}
          fields={(form.fields ?? []) as never}
        />
      )}
    </main>
  )
}
