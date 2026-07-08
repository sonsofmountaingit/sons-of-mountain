import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(request: Request) {
  if (!(await verifyPayloadJWT())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = await getPayload({ config })

  let body: { puckData?: any }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const puckData = body.puckData
  const content: any[] = puckData?.content ?? []

  const get = (type: string) => content.find((b: any) => b.type === type)?.props ?? {}

  const hero = get('VouchersHeroBlock')
  const tabs = get('VouchersTabsBlock')
  const buyForm = get('VouchersBuyFormBlock')
  const redeem = get('VouchersRedeemBlock')
  const mine = get('VouchersMineBlock')

  const merged: Record<string, unknown> = { ...hero, ...tabs, ...buyForm, ...redeem, ...mine }

  const updateData: Record<string, unknown> = { puckData }
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) updateData[key] = value
  }

  await payload.updateGlobal({ slug: 'vouchers', data: updateData, overrideAccess: true }).catch(() => {})

  ;(revalidateTag as any)('vouchers', 'max')
  return Response.json({ ok: true })
}
