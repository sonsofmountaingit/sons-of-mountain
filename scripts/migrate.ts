import 'dotenv/config'
import pg from 'pg'

async function main() {
  // Remove dev-mode migration records (batch = -1) via raw SQL BEFORE Payload
  // initializes, so the interactive prompt never fires.
  const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  await client.query(`DELETE FROM payload_migrations WHERE batch = -1`).catch(() => {/* table may not exist on fresh DB */})
  await client.end()

  // Now run migrations normally — no prompt will appear.
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload/payload.config')
  const payload = await getPayload({ config })
  await payload.db.migrate()
  console.log('Migrations complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
