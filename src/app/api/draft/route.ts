import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const disable = searchParams.get('disable')
  const secret = searchParams.get('secret')

  // Verify secret matches PAYLOAD_SECRET
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const draft = await draftMode()

  if (disable) {
    draft.disable()
    return NextResponse.json({ draft: false })
  }

  // Verify authenticated user (Payload admin / editor)
  const payload = await getPayload({ config })
  const me = await payload.auth({ headers: request.headers as Headers })
  if (!me?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  draft.enable()
  redirect(`/${slug ?? ''}`)
}
