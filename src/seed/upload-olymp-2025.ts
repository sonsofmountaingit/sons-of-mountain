/**
 * Uploads and optimizes photos from ~/Downloads/Олимп 2025 into Payload,
 * attaching them to the "Олимп, Гърция, август 2024" gallery collection.
 *
 * Run: bun src/seed/upload-olymp-2025.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import fs from 'fs'
import os from 'os'
import sharp from 'sharp'

const SOURCE_DIR = path.join(os.homedir(), 'Downloads', 'Олимп 2025')
const MAX_DIMENSION = 2560

async function optimizeToBuffer(filePath: string) {
  const image = sharp(filePath, { failOn: 'none' }).rotate()
  const metadata = await image.metadata()
  const shouldResize = (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION
  return image
    .resize(shouldResize ? { width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true } : undefined)
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()
}

async function main() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()

  console.log(`Found ${files.length} images in ${SOURCE_DIR}`)

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'gallery-collections',
    where: { slug: { equals: 'olymp-2025' } },
    limit: 1,
  })

  const mediaEntries: { image: number | string; caption?: string }[] = []
  let coverId: number | string | undefined

  for (const [i, filename] of files.entries()) {
    const filePath = path.join(SOURCE_DIR, filename)
    console.log(`[${i + 1}/${files.length}] optimizing + uploading: ${filename}`)
    const buffer = await optimizeToBuffer(filePath)
    const outName = filename.replace(/\.(jpe?g|png)$/i, '.jpg').replace(/\s+/g, '-')

    const media = await payload.create({
      collection: 'media',
      data: { alt: `Олимп, Гърция, август 2024 — ${outName}` },
      file: {
        data: buffer,
        mimetype: 'image/jpeg',
        name: outName,
        size: buffer.length,
      },
      overrideAccess: true,
    })

    mediaEntries.push({ image: media.id })
    if (i === 0) coverId = media.id
  }

  const data = {
    title: 'Олимп, Гърция, август 2024',
    slug: 'olymp-2025',
    coverImage: coverId,
    status: 'published' as const,
    publishedAt: new Date('2024-08-16').toISOString(),
    images: mediaEntries,
  }

  if (existing.docs[0]) {
    const doc = await payload.update({
      collection: 'gallery-collections',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    console.log('Updated gallery collection:', doc.id)
  } else {
    const doc = await payload.create({
      collection: 'gallery-collections',
      data,
      overrideAccess: true,
    })
    console.log('Created gallery collection:', doc.id)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
