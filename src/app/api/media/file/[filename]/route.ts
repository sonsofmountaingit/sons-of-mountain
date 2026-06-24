import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync } from 'fs'
import { join } from 'path'
import { Readable } from 'stream'

export const dynamic = 'force-dynamic'

const MEDIA_DIR = join(process.cwd(), 'public/media')

const MIME: Record<string, string> = {
  webp: 'image/webp', avif: 'image/avif', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', gif: 'image/gif', svg: 'image/svg+xml', mp4: 'video/mp4',
  webm: 'video/webm', mov: 'video/quicktime',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params
  const safeName = decodeURIComponent(filename).replace(/\.\./g, '')
  const filePath = join(MEDIA_DIR, safeName)
  const ext = safeName.split('.').pop()?.toLowerCase() ?? ''

  try {
    const stat = statSync(filePath)
    const stream = createReadStream(filePath)
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
