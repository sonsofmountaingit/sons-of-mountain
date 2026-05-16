import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'

export async function GET() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'gallery-collections',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
    depth: 1,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://panicframe.com'

  const items = docs.map((c: any) => {
    const cover = mediaUrl(c.coverImage?.url)
    const photographer = typeof c.photographer === 'object' ? c.photographer?.name : ''
    return `
    <item>
      <title><![CDATA[${c.title}]]></title>
      <link>${baseUrl}/gallery/${c.slug}</link>
      <guid>${baseUrl}/gallery/${c.slug}</guid>
      <pubDate>${new Date(c.publishedAt ?? c.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${c.description ?? ''}]]></description>
      ${photographer ? `<author>${photographer}</author>` : ''}
      ${cover ? `<enclosure url="${baseUrl}${cover}" type="image/jpeg" length="0" />` : ''}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Паник Фрейм — Галерия</title>
    <link>${baseUrl}/gallery</link>
    <description>Нови фото галерии от нашите дестинации</description>
    <language>bg</language>
    <atom:link href="${baseUrl}/gallery/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
