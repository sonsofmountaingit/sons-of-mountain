import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { linkGuestRecordsToCustomer } from '@/payload/collections/Customers'

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token || token.length !== 40) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', request.url))
  }

  try {
    const payload = await getPayload({ config })
    const customerResult = await payload.find({
      collection: 'customers',
      where: { _verificationToken: { equals: token } },
      limit: 1,
      depth: 0,
    })
    const customer = customerResult.docs[0] as { id: string | number; email?: string } | undefined
    const verified = await payload.verifyEmail({ collection: 'customers', token })
    if (!verified || !customer?.email) throw new Error('Verification failed')
    await linkGuestRecordsToCustomer(payload, customer.id, customer.email)

    return NextResponse.redirect(new URL('/verify-email?verified=1', request.url))
  } catch {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', request.url))
  }
}
