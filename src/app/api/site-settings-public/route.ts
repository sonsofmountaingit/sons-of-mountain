import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    const media = settings.loginBackground as { url?: string; mimeType?: string } | null | undefined
    return Response.json({
      loginBackgroundUrl: media?.url ?? null,
      loginBackgroundType: media?.mimeType?.startsWith('video/') ? 'video' : 'image',
    })
  } catch {
    return Response.json({ loginBackgroundUrl: null })
  }
}
