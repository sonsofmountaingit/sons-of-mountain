import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload/payload.config'

async function main() {
  const payload = await getPayload({ config })
  await payload.db.migrate()
  console.log('Migrations complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
