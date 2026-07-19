import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

function page(heading: string, subtext: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:480px;margin:0 auto;padding:80px 24px;text-align:center">
  <h1 style="color:#fff;font-size:24px;font-weight:300;margin:0 0 16px 0">${heading}</h1>
  <p style="color:#888;font-size:14px;margin:0 0 32px 0">${subtext}</p>
  <a href="/" style="color:#fff;font-size:12px;text-decoration:underline">Върни се към сайта</a>
</div>
</body></html>`
}

// GET — branded one-click unsubscribe link used in transactional/campaign email footers.
// Supports both ?token= (subscribers, via unsubscribeToken) and ?email= (customers, no token).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const email = req.nextUrl.searchParams.get('email')
  const payload = await getPayload({ config })

  if (!token && !email) {
    return new NextResponse(page('Невалидна връзка.', ''), { status: 400, headers: { 'Content-Type': 'text/html' } })
  }
  const where: Where = token ? { unsubscribeToken: { equals: token } } : { email: { equals: email as string } }

  const found = await payload.find({ collection: 'subscribers', where, limit: 1 })
  if (!found.docs[0]) {
    return new NextResponse(page('Невалидна връзка или вече отписан.', ''), { status: 404, headers: { 'Content-Type': 'text/html' } })
  }

  await payload.update({ collection: 'subscribers', id: found.docs[0].id, data: { status: 'unsubscribed' } })

  return new NextResponse(
    page('Отписан си успешно.', 'Няма да получаваш повече имейли от нас.'),
    { status: 200, headers: { 'Content-Type': 'text/html' } },
  )
}

// POST — pre-existing JSON API used by in-app unsubscribe forms (email-only, no token).
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'subscribers',
        id: existing.docs[0].id,
        data: { status: 'unsubscribed' },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
