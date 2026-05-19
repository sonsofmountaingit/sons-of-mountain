import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge'

export const metadata: Metadata = { title: 'My Orders — Sons of Mountains' }

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login?redirect=/shop/orders')

  const payload = await getPayload({ config })
  const betterAuthUserId = (session.user as any).id

  const customer = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: betterAuthUserId } },
    limit: 1,
  })
  const cust = customer.docs[0]

  const orders = cust
    ? await payload.find({
        collection: 'orders',
        where: { customer: { equals: cust.id } },
        sort: '-createdAt',
        limit: 20,
        depth: 1,
      })
    : { docs: [], totalDocs: 0 }

  const registrations = cust
    ? await payload.find({
        collection: 'registrations',
        where: { customer: { equals: cust.id } },
        sort: '-createdAt',
        limit: 20,
        depth: 1,
      })
    : { docs: [], totalDocs: 0 }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.docs.length === 0 && registrations.docs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No orders yet.</p>
          <Link href="/shop" className="rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white">Browse shop</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.docs.map((order: any) => (
            <Link key={order.id} href={`/shop/orders/${order.id}`} className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                {order.items?.length > 0 && <p className="text-xs text-gray-400 mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <OrderStatusBadge status={order.status} />
                <p className="font-semibold">€{(order.totalAmount ?? 0).toFixed(2)}</p>
              </div>
            </Link>
          ))}

          {registrations.docs.map((reg: any) => {
            const dest = typeof reg.destination === 'object' ? reg.destination : null
            const trip = typeof reg.trip === 'object' ? reg.trip : null
            const prog = typeof reg.program === 'object' ? reg.program : null
            const name = dest?.name ?? trip?.title ?? prog?.title ?? 'Booking'
            return (
              <div key={reg.id} className="flex items-center justify-between rounded-lg border bg-white p-4">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-500">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                  <p className="text-xs text-gray-400 mt-1">Registration</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <OrderStatusBadge status={reg.status} />
                  <p className="font-semibold">€{(reg.totalAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
