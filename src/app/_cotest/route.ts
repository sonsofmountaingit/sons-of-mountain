import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// TEMP diagnostic route: isolate which payload.create shape hangs inside the server request.
export async function GET() {
  const payload = await getPayload({ config })
  const out: Record<string, string> = {}
  const time = async (label: string, fn: () => Promise<any>) => {
    const t = Date.now()
    try {
      const r = await Promise.race([
        fn(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('HUNG>8s')), 8000)),
      ])
      out[label] = `ok ${Date.now() - t}ms id=${(r as any)?.id ?? '?'}`
    } catch (e: any) {
      out[label] = `ERR ${Date.now() - t}ms ${e?.message ?? e}`
    }
  }

  await time('find-customers', () =>
    payload.find({ collection: 'customers', limit: 1, depth: 0 }))
  await time('create-no-items', () =>
    payload.create({ collection: 'orders', data: { status: 'pending', email: 'a@a.com', firstName: 'a', lastName: 'b', phone: '1', currency: 'EUR', totalAmount: 80, paymentMode: 'full', participationType: 'solo' } as any }))
  await time('create-with-items', () =>
    payload.create({ collection: 'orders', data: { status: 'pending', email: 'a@a.com', firstName: 'a', lastName: 'b', phone: '1', currency: 'EUR', totalAmount: 80, paymentMode: 'full', participationType: 'solo', items: [{ itemType: 'destination', destination: 1, quantity: 1, unitPrice: 80 }] } as any }))

  return NextResponse.json(out)
}
