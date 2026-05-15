import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', limit: 100 })
  for (const doc of docs) {
    const url = (doc as any).url as string
    if (url && url.startsWith('http://localhost:3000/media/')) {
      const fixed = url.replace('http://localhost:3000/media/', '/media/')
      await payload.update({ collection: 'media', id: doc.id, data: { url: fixed } as any, overrideAccess: true })
      console.log(`Fixed: ${url} -> ${fixed}`)
    } else if (url && url.includes('/api/media/file/')) {
      const fixed = url.replace(/^https?:\/\/[^/]+\/api\/media\/file\//, '/media/')
      await payload.update({ collection: 'media', id: doc.id, data: { url: fixed } as any, overrideAccess: true })
      console.log(`Fixed: ${url} -> ${fixed}`)
    }
  }
  console.log('Done.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
