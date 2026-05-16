import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Verify Payload admin session
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { betterAuthId } = await req.json()
    if (!betterAuthId) return NextResponse.json({ error: 'Missing betterAuthId' }, { status: 400 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (auth.api.revokeSessions as any)({ body: { userId: betterAuthId } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Block user error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
