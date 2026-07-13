/**
 * Batch gallery uploader.
 *
 * Usage:
 *   PAYLOAD_EMAIL='...' PAYLOAD_PASSWORD='...' node upload-batch.mjs
 *
 * Resumable: progress is saved per-job to upload-batch-progress/<slug>.json.
 * Re-running skips already-uploaded files and already-completed jobs.
 * Prints progress to stdout as it goes.
 */

import fs from 'fs'
import path from 'path'
import os from 'os'
import sharp from 'sharp'

const BASE = 'https://sonsofmountain.com'
const EMAIL = process.env.PAYLOAD_EMAIL
const PASSWORD = process.env.PAYLOAD_PASSWORD
const MAX_DIMENSION = 2560
const DOWNLOADS = path.join(os.homedir(), 'Downloads')
const PROGRESS_DIR = path.join(process.cwd(), 'upload-batch-progress')

fs.mkdirSync(PROGRESS_DIR, { recursive: true })

// One job per gallery collection.
// sourceDirs: list of folders to pull images from (supports multiple, e.g. subfolders).
const JOBS = [
  {
    title: 'Курс за планински водачи АПХ',
    slug: 'kurs-za-planinski-vodachi',
    sourceDirs: [path.join(DOWNLOADS, 'Курс за планински водачи към Асоциация _Планини и хора_')],
  },
  {
    title: 'Елбрус',
    slug: 'elbrus',
    sourceDirs: [path.join(DOWNLOADS, 'Елбрус ')],
  },
  {
    title: 'Ком-Емине 2025г',
    slug: 'kom-emine',
    sourceDirs: [path.join(DOWNLOADS, 'Ком Емине 2025')],
  },
  {
    title: 'Лайла 4009 м.',
    slug: 'laila-4009',
    sourceDirs: [path.join(DOWNLOADS, 'ЛАЙЛА 4009 м.')],
  },
  {
    title: 'Арарат 5137 м.',
    slug: 'ararat-5137',
    sourceDirs: [path.join(DOWNLOADS, 'АРАРАТ 5137 м.')],
  },
  {
    title: 'Дамавенд 5610 м.',
    slug: 'damavand-5610',
    sourceDirs: [path.join(DOWNLOADS, 'ДАМАВАНД 5610 м.')],
  },
  {
    title: 'Северен Пинд',
    slug: 'severen-pind',
    sourceDirs: [
      path.join(DOWNLOADS, 'СЕВЕРЕН ПИНД', 'вр. Гамила 2497 м. пл. Тимфи'),
      path.join(DOWNLOADS, 'СЕВЕРЕН ПИНД', 'вр. Смоликас 2637 м. пл Смолика'),
    ],
  },
  {
    title: 'Триглав 2864 м., Словения',
    slug: 'triglav-2864',
    sourceDirs: [path.join(DOWNLOADS, 'ТРИГЛАВ 2864 м., СЛОВЕНИЯ')],
  },
  {
    title: 'вр. Митикас 2917 м., Гърция',
    slug: 'mitikas-2917',
    sourceDirs: [path.join(DOWNLOADS, 'вр. МИТИКАС 2917 м., ГЪРЦИЯ')],
  },
]

function log(...args) {
  console.log(new Date().toISOString().slice(11, 19), ...args)
}

function loadProgress(slug) {
  const file = path.join(PROGRESS_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return {}
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function saveProgress(slug, progress) {
  const file = path.join(PROGRESS_DIR, `${slug}.json`)
  fs.writeFileSync(file, JSON.stringify(progress, null, 2))
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
      log(`  retry ${attempt}/${retries}: ${err.message}`)
      await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
}

async function findOrCreateCollection(token, job) {
  const getRes = await fetch(`${BASE}/api/gallery-collections?where[slug][equals]=${job.slug}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const getData = await getRes.json()
  if (getData.docs?.[0]) return getData.docs[0]

  const createRes = await fetch(`${BASE}/api/gallery-collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ title: job.title, slug: job.slug, status: 'draft' }),
  })
  if (!createRes.ok) throw new Error(`create failed for ${job.slug}: ${createRes.status} ${await createRes.text()}`)
  const created = await createRes.json()
  return created.doc
}

async function addToFeatured(token, collectionId) {
  const gRes = await fetch(`${BASE}/api/globals/gallery?depth=0`, { headers: { Authorization: `JWT ${token}` } })
  const gData = await gRes.json()
  const already = (gData.featuredCollections ?? []).some((f) => f.collection === collectionId)
  if (already) return

  const featuredCollections = [...(gData.featuredCollections ?? []), { collection: collectionId }]
  const cleaned = { ...gData, featuredCollections }
  delete cleaned.id
  delete cleaned.updatedAt
  delete cleaned.createdAt
  delete cleaned.globalType

  const patch = await fetch(`${BASE}/api/globals/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(cleaned),
  })
  if (!patch.ok) throw new Error(`featured collections update failed: ${patch.status} ${await patch.text()}`)
}

async function runJob(token, job) {
  log(`=== ${job.title} (${job.slug}) ===`)

  const files = []
  for (const dir of job.sourceDirs) {
    if (!fs.existsSync(dir)) {
      log(`  WARNING: source dir missing: ${dir}`)
      continue
    }
    const dirFiles = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|heic)$/i.test(f)).sort()
    for (const f of dirFiles) files.push({ dir, filename: f })
  }

  if (files.length === 0) {
    log(`  no images found, skipping`)
    return
  }
  log(`  found ${files.length} images`)

  const progress = loadProgress(job.slug)

  for (const [i, { dir, filename }] of files.entries()) {
    const key = path.join(dir, filename)
    if (progress[key]) {
      log(`  [${i + 1}/${files.length}] skip: ${filename}`)
      continue
    }
    const filePath = path.join(dir, filename)
    log(`  [${i + 1}/${files.length}] ${filename}`)
    try {
      const buffer = await optimize(filePath)
      const outName = filename.replace(/\.(jpe?g|png|heic)$/i, '.jpg').replace(/\s+/g, '-')
      const media = await uploadWithRetry(token, buffer, outName, `${job.title} — ${outName}`)
      progress[key] = media.id
      saveProgress(job.slug, progress)
      log(`    -> media id ${media.id}`)
    } catch (err) {
      log(`    SKIP (failed): ${filename}: ${err.message}`)
    }
  }

  const collection = await findOrCreateCollection(token, job)
  const mediaEntries = files
    .map(({ dir, filename }) => ({ image: progress[path.join(dir, filename)] }))
    .filter((entry) => entry.image)
  const coverId = mediaEntries[0]?.image

  const patchRes = await fetch(`${BASE}/api/gallery-collections/${collection.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({
      coverImage: coverId,
      status: 'published',
      images: mediaEntries,
    }),
  })
  if (!patchRes.ok) throw new Error(`patch failed for ${job.slug}: ${patchRes.status} ${await patchRes.text()}`)
  log(`  collection updated: id ${collection.id}, ${mediaEntries.length} images, published`)

  await addToFeatured(token, collection.id)
  log(`  added to Site Settings -> Gallery featured collections (or already present)`)
}

async function main() {
  const token = await login()
  log('logged in')

  for (const job of JOBS) {
    try {
      await runJob(token, job)
    } catch (err) {
      log(`  ERROR in job "${job.slug}": ${err.message}`)
    }
  }

  log('all jobs finished')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
