import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`registration-form-submit:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { formId?: string; data?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.formId || !body.data) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'registrations',
    where: { registrationFormToken: { equals: token } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const registration = docs[0]
  if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { docs: existing } = await payload.find({
    collection: 'form-submissions',
    where: { registration: { equals: registration.id }, registrationForm: { equals: body.formId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.length > 0) return NextResponse.json({ error: 'Already submitted' }, { status: 409 })

  const form = await payload.findByID({ collection: 'registration-forms', id: body.formId, depth: 0, overrideAccess: true }).catch(() => null)
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const allowedKeys = new Set((form.fields ?? []).map((f: { fieldKey: string }) => f.fieldKey))
  const cleanedData: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body.data)) {
    if (allowedKeys.has(key)) cleanedData[key] = value
  }

  await payload.create({
    collection: 'form-submissions',
    data: {
      registration: registration.id,
      registrationForm: body.formId,
      data: cleanedData,
      submittedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  await payload.update({
    collection: 'registrations',
    id: registration.id,
    data: { registrationFormSubmittedAt: new Date().toISOString() },
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true })
}
