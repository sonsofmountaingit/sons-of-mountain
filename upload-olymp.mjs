import fs from 'fs'
import path from 'path'
import os from 'os'
import sharp from 'sharp'

const BASE = 'https://sonsofmountain.com'
const EMAIL = process.env.PAYLOAD_EMAIL
const PASSWORD = process.env.PAYLOAD_PASSWORD
const SOURCE_DIR = path.join(os.homedir(), 'Downloads', 'Олимп 2025')
const MAX_DIMENSION = 2560

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.token
}

async function optimize(filePath) {
  const image = sharp(filePath, { failOn: 'none' }).rotate()
  const meta = await image.metadata()
  const shouldResize = (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION
  return image
    .resize(shouldResize ? { width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true } : undefined)
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()
}

async function uploadMedia(token, buffer, filename, alt) {
  const form = new FormData()
  form.set('file', new Blob([buffer], { type: 'image/jpeg' }), filename)
  form.set('_payload', JSON.stringify({ alt }))
  const res = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  if (!res.ok) throw new Error(`upload failed for ${filename}: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.doc
}

async function main() {
  const token = await login()
  console.log('logged in')

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()
  console.log(`found ${files.length} images`)

  const mediaEntries = []
  let coverId

  for (const [i, filename] of files.entries()) {
    const filePath = path.join(SOURCE_DIR, filename)
    console.log(`[${i + 1}/${files.length}] ${filename}`)
    const buffer = await optimize(filePath)
    const outName = filename.replace(/\.(jpe?g|png)$/i, '.jpg').replace(/\s+/g, '-')
    const media = await uploadMedia(token, buffer, outName, `Олимп, Гърция, август 2024 — ${outName}`)
    mediaEntries.push({ image: media.id })
    if (i === 0) coverId = media.id
    console.log(`  -> media id ${media.id}`)
  }

  const getRes = await fetch(`${BASE}/api/gallery-collections?where[slug][equals]=olimp&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const getData = await getRes.json()
  const existing = getData.docs?.[0]
  if (!existing) throw new Error('gallery collection with slug "olimp" not found')

  const patchRes = await fetch(`${BASE}/api/gallery-collections/${existing.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({
      coverImage: coverId,
      status: 'published',
      images: mediaEntries,
    }),
  })
  if (!patchRes.ok) throw new Error(`patch failed: ${patchRes.status} ${await patchRes.text()}`)
  console.log('gallery collection updated:', existing.id)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
