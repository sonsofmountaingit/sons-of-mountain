import 'dotenv/config'

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload/payload.config')
  const p = await getPayload({ config })
  console.error('payload ready, pool total:', (p.db as any)?.pool?.totalCount, 'max:', (p.db as any)?.pool?.options?.max)

  // Fire N concurrent creates to reproduce pool contention like the live server under load
  const N = Number(process.env.N ?? 1)
  const t = Date.now()
  const results = await Promise.allSettled(
    Array.from({ length: N }, (_, i) =>
      Promise.race([
        p.create({
          collection: 'orders',
          data: {
            status: 'pending', email: `r${i}@t.com`, firstName: 'R', lastName: 'T', phone: '1',
            currency: 'EUR', totalAmount: 80, paymentMode: 'full', participationType: 'solo',
            items: [{ itemType: 'destination', destination: 1, quantity: 1, unitPrice: 80 }],
          } as any,
        }).then((r: any) => `ok id=${r.id}`),
        new Promise((_, rej) => setTimeout(() => rej(new Error('HUNG >12s')), 12000)),
      ]),
    ),
  )
  console.error(`N=${N} done in ${Date.now() - t}ms`)
  results.forEach((r, i) => console.error(i, r.status, (r as any).value ?? (r as any).reason?.message))
  process.exit(0)
}
main().catch((e) => { console.error('ERR', e); process.exit(1) })
