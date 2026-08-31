import 'dotenv/config'
async function main() {
  // Never mutate migration history outside Payload's migration transaction.
  // This script intentionally does not delete or rewrite existing records.

  // Now run migrations normally.
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
