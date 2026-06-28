import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const [
      { docs: destinations },
      { docs: trips },
      { docs: programs },
      { docs: blogPosts },
      { docs: stories },
    ] = await Promise.all([
      payload.find({ collection: 'destinations', limit: 200, depth: 0 }),
      payload.find({ collection: 'trips', limit: 200, depth: 0 }),
      payload.find({ collection: 'programs', limit: 200, depth: 0 }),
      payload.find({ collection: 'blog-posts', limit: 100, depth: 0 }),
      payload.find({ collection: 'stories', limit: 100, depth: 0 }),
    ])

    const lines: string[] = []

    lines.push('# Sons of Mountains — Пълно съдържание за AI')
    lines.push('')
    lines.push('> Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението.')
    lines.push('')
    lines.push('Sons of Mountains е Bulgarian travel platform за организирани пътувания и фотографски експедиции.')
    lines.push('')

    lines.push('## Дестинации')
    lines.push('')
    for (const d of destinations) {
      const dest = d as any
      lines.push(`### ${dest.name}`)
      lines.push(`URL: ${BASE_URL}/destinations/${dest.slug}`)
      if (dest.introText) lines.push(dest.introText)
      lines.push('')
    }

    lines.push('## Пътувания')
    lines.push('')
    for (const t of trips) {
      const trip = t as any
      lines.push(`### ${trip.title}`)
      lines.push(`URL: ${BASE_URL}/trips/${trip.slug}`)
      if (trip.shortDescription) lines.push(trip.shortDescription)
      if (trip.startDate) lines.push(`Начало: ${trip.startDate}`)
      if (trip.endDate) lines.push(`Край: ${trip.endDate}`)
      lines.push('')
    }

    lines.push('## Програми')
    lines.push('')
    for (const p of programs) {
      const prog = p as any
      lines.push(`### ${prog.title}`)
      lines.push(`URL: ${BASE_URL}/programs/${prog.slug}`)
      if (prog.shortDescription) lines.push(prog.shortDescription)
      lines.push('')
    }

    lines.push('## Блог')
    lines.push('')
    for (const b of blogPosts) {
      const post = b as any
      lines.push(`### ${post.title}`)
      lines.push(`URL: ${BASE_URL}/blog/${post.slug}`)
      if (post.excerpt) lines.push(post.excerpt)
      lines.push('')
    }

    lines.push('## Истории')
    lines.push('')
    for (const s of stories) {
      const story = s as any
      lines.push(`### ${story.title}`)
      lines.push(`URL: ${BASE_URL}/stories/${story.slug}`)
      lines.push('')
    }

    const content = lines.join('\n')

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return new Response('# Sons of Mountains\n\nSite content temporarily unavailable.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
