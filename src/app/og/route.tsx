import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

// og:image is embedded on nearly every page and gets hit repeatedly by link-preview
// crawlers (Facebook, Slack, WhatsApp, etc). Cache aggressively so the same
// title/image combination isn't re-rendered on every crawl, and keep the logo
// in memory (read once from disk) instead of fetching it over HTTP on every request.
const OG_CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

let logoDataUrlPromise: Promise<string> | undefined
async function getLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = readFile(join(process.cwd(), 'public/white-logo-2.png')).then(
      (buf) => `data:image/png;base64,${buf.toString('base64')}`,
    )
  }
  return logoDataUrlPromise
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Sons of Mountains'
  const image = searchParams.get('image')

  let logo: string
  try {
    logo = await getLogoDataUrl()
  } catch {
    logoDataUrlPromise = undefined
    return new Response('Failed to generate the image', { status: 500 })
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#0a0a0a',
          }}
        >
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              width={1200}
              height={630}
              style={{ position: 'absolute', inset: 0, objectFit: 'cover', width: '100%', height: '100%' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={220} height={220} />
            <div
              style={{
                marginTop: 32,
                fontSize: 48,
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
                maxWidth: '900px',
                padding: '0 40px',
              }}
            >
              {title}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, headers: { 'Cache-Control': OG_CACHE_CONTROL } },
    )
  } catch (e) {
    console.error('Failed to generate og image:', e)
    return new Response('Failed to generate the image', { status: 500 })
  }
}
