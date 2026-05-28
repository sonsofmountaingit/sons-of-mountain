#!/usr/bin/env bun
import { readFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'destinations',
  where: { slug: { equals: 'uganda' } },
  depth: 0,
  overrideAccess: true,
  limit: 1,
})
const dest = docs[0] as any
if (!dest) { console.error('Uganda not found'); process.exit(1) }
console.log('Uganda id:', dest.id)

const files = [
  { path: '/tmp/uganda-v1.mp4', filename: 'uganda-why-1.mp4', label: 'Природата на Уганда' },
  { path: '/tmp/uganda-v2.mp4', filename: 'uganda-why-2.mp4', label: 'Дивата природа' },
]

const mediaIds: number[] = []

for (const f of files) {
  const buf = readFileSync(f.path)
  const doc = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt: f.label },
    file: { data: buf, mimetype: 'video/mp4', name: f.filename, size: buf.length },
  })
  console.log('Uploaded', f.filename, '→ id', doc.id)
  mediaIds.push(doc.id as number)
}

await payload.update({
  collection: 'destinations',
  id: dest.id,
  overrideAccess: true,
  data: {
    whyVideos: mediaIds.map((id, i) => ({ video: id, label: files[i].label })),
  } as any,
})
console.log('Done — Uganda whyVideos set to media ids', mediaIds)
process.exit(0)
