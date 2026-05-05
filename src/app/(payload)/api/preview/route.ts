import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection') ?? 'pages'
  const secret = searchParams.get('secret')

  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }
  if (!slug) return new Response('Missing slug', { status: 400 })

  const payload = await getPayload({ config })
  const me = await payload.auth({ headers: req.headers as never })
  if (!me?.user) return new Response('Unauthorized', { status: 401 })

  const draft = await draftMode()
  draft.enable()

  redirect(`/${slug}`)
}
