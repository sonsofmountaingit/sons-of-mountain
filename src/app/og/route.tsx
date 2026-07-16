import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Sons of Mountains'
  const image = searchParams.get('image')
  const logo = `${BASE_URL}/white-logo-2.png`

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
    { width: 1200, height: 630 },
  )
}
