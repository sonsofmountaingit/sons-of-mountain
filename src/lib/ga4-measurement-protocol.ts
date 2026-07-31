import { createHash } from 'crypto'

interface Ga4Item {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_category?: string
}

interface Ga4Event {
  name: string
  params: Record<string, unknown>
}

function pseudoClientId(seed: string): string {
  const hash = createHash('sha256').update(seed).digest('hex')
  return `${parseInt(hash.slice(0, 8), 16)}.${parseInt(hash.slice(8, 16), 16)}`
}

async function sendGa4Event(clientIdSeed: string, event: Ga4Event): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) return

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`

  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        client_id: pseudoClientId(clientIdSeed),
        events: [event],
      }),
    })
  } catch (err) {
    console.error('[ga4-measurement-protocol] send failed', event.name, err)
  }
}

export async function sendGa4Refund(params: {
  orderId: string
  transactionId: string
  value: number
  currency: string
  items: Ga4Item[]
}): Promise<void> {
  await sendGa4Event(params.orderId, {
    name: 'refund',
    params: {
      transaction_id: params.transactionId,
      currency: params.currency,
      value: params.value,
      items: params.items,
    },
  })
}

export async function sendGa4Purchase(params: {
  orderId: string
  transactionId: string
  value: number
  currency: string
  items: Ga4Item[]
}): Promise<void> {
  await sendGa4Event(params.orderId, {
    name: 'purchase',
    params: {
      transaction_id: params.transactionId,
      currency: params.currency,
      value: params.value,
      items: params.items,
    },
  })
}
