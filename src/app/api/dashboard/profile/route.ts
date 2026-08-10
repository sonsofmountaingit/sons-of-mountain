import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  preferredLang: z.enum(['BG', 'EN', 'DE', 'RU']),
  dateOfBirth: z.string().date().optional().or(z.literal('')),
  address: z.string().trim().max(300).optional(),
})

async function getAuthenticatedCustomer() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') return { payload, user: null }
  return { payload, user }
}

export async function GET() {
  const { payload, user } = await getAuthenticatedCustomer()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const customer = await payload.findByID({ collection: 'customers', id: user.id, depth: 0 })
  return NextResponse.json({ profile: serializeProfile(customer) })
}

export async function PATCH(request: NextRequest) {
  const { payload, user } = await getAuthenticatedCustomer()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = profileSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалидни данни за профила.' }, { status: 400 })
  }

  const data = parsed.data
  const customer = await payload.update({
    collection: 'customers',
    id: user.id,
    data: {
      name: data.name,
      phone: data.phone || null,
      preferredLang: data.preferredLang,
      dateOfBirth: data.dateOfBirth || null,
      address: data.address || null,
    },
    depth: 0,
  })

  return NextResponse.json({ profile: serializeProfile(customer) })
}

function serializeProfile(customer: Record<string, unknown>) {
  const preferredLang = customer.preferredLang
  return {
    name: typeof customer.name === 'string' ? customer.name : '',
    email: typeof customer.email === 'string' ? customer.email : '',
    phone: typeof customer.phone === 'string' ? customer.phone : '',
    preferredLang: preferredLang === 'EN' || preferredLang === 'DE' || preferredLang === 'RU' ? preferredLang : 'BG',
    dateOfBirth: customer.dateOfBirth ? String(customer.dateOfBirth).slice(0, 10) : '',
    address: typeof customer.address === 'string' ? customer.address : '',
  }
}
