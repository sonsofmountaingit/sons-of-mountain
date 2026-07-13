import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const BASE = 'https://sonsofmountain.com'
const EMAIL = process.env.PAYLOAD_EMAIL
const PASSWORD = process.env.PAYLOAD_PASSWORD
const SOURCE_DIR = process.env.SOURCE_DIR
const SLUG = process.env.SLUG
const ALT_PREFIX = process.env.ALT_PREFIX
const PROGRESS_FILE = process.env.PROGRESS_FILE
const MAX_DIMENSION = 2560

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return {}
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'))
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

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

async function uploadWithRetry(token, buffer, filename, alt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await uploadMedia(token, buffer, filename, alt)
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
}

async function main() {
  const token = await login()

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()

  const progress = loadProgress()

  for (const filename of files) {
    if (progress[filename]) continue
    const filePath = path.join(SOURCE_DIR, filename)
    const buffer = await optimize(filePath)
    const outName = filename.replace(/\.(jpe?g|png)$/i, '.jpg').replace(/\s+/g, '-')
    const media = await uploadWithRetry(token, buffer, outName, `${ALT_PREFIX} — ${outName}`)
    progress[filename] = media.id
    saveProgress(progress)
  }

  const mediaEntries = files.map((f) => ({ image: progress[f] }))
  const coverId = progress[files[0]]

  const getRes = await fetch(`${BASE}/api/gallery-collections?where[slug][equals]=${SLUG}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const getData = await getRes.json()
  const existing = getData.docs?.[0]
  if (!existing) throw new Error(`gallery collection with slug "${SLUG}" not found`)

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

  console.log('done:', existing.id, existing.slug ?? SLUG)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
