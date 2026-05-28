import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ tripId: string }> }

export default async function ShopTripRedirect({ params }: Props) {
  const { tripId } = await params

  try {
    const payload = await getPayload({ config })
    const trip = await payload.findByID({ collection: 'trips', id: tripId, depth: 0, overrideAccess: true })
    const slug = (trip as Record<string, unknown>).slug as string | null
    redirect(slug ? `/trips/${slug}` : '/trips')
  } catch {
    redirect('/trips')
  }
}
