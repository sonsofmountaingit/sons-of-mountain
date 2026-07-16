import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    // Verify Payload admin session
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || user.collection !== 'users' || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Session revocation is superseded by the beforeLogin status gate on Customers —
    // once status !== 'active', new logins are blocked; existing JWTs expire naturally.
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Block user error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
