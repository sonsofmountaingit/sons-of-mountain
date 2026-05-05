import { getPayload } from 'payload'
import config from '@payload-config'

async function clearPages() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'pages', limit: 1000 })
  for (const doc of docs) {
    await payload.delete({ collection: 'pages', id: doc.id })
    console.log(`  ✗ ${(doc as { title?: string }).title ?? doc.id}`)
  }
  console.log(`\nDeleted ${docs.length} page(s).`)
  process.exit(0)
}

clearPages().catch((err) => {
  console.error(err)
  process.exit(1)
})
