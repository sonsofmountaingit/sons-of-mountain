import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })
  await payload.updateGlobal({
    slug: 'hero',
    data: { puckData: null },
    overrideAccess: true,
  })
  console.log('Hero puckData reset.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
