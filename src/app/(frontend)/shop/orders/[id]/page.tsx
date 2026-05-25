import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge'
import { Suspense } from 'react'


export const metadata: Metadata = { title: 'Order Details — Sons of Mountains' }

async function getCachedOrderData(orderId: string, betterAuthUserId: string) {
  try {
    const payload = await getPayload({ config })
    const customer = await payload.find({
      collection: 'customers',
      where: { betterAuthId: { equals: betterAuthUserId } },
      limit: 1,
    })
    const cust = customer.docs[0]
    if (!cust) return null
    const orderResult = await payload.find({
      collection: 'orders',
      where: { id: { equals: orderId } },
      limit: 1,
      depth: 2,
    })
    const order = orderResult.docs[0]
    if (!order || order.customer !== cust.id) return null
    return order
  } catch {
    return null
  }
}

async function OrderDetailContent({ id }: { id: string }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login?redirect=/shop/orders')

  const betterAuthUserId = (session.user as any).id
  const order = await getCachedOrderData(id, betterAuthUserId)

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Order Not Found</h1>
        <p className="text-gray-600 mb-4">We couldn't find this order.</p>
        <Link href="/shop/orders" className="text-blue-600 hover:underline">
          Back to orders
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/shop/orders" className="text-sm text-gray-600 hover:text-gray-800 mb-4 inline-block">
          ← Back to orders
        </Link>
        <h1 className="text-3xl font-bold">Order #{String(order.id).slice(-8).toUpperCase()}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Status</p>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Order Date</p>
          <p className="text-lg font-semibold">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Total Amount</p>
          <p className="text-lg font-semibold">€{(order.totalAmount ?? 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{item.title || 'Item'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.itemType && (
                      <>
                        <span className="capitalize">{item.itemType}</span>
                        {item.quantity && <span> • Qty: {item.quantity}</span>}
                      </>
                    )}
                  </p>
                </div>
                <p className="font-semibold">€{((item.unitPrice ?? 0) * (item.quantity ?? 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items in this order.</p>
        )}
      </div>

      {order.paymentMode === 'deposit' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Payment Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Deposit Paid</p>
              <p className="text-lg font-semibold">€{(order.depositAmount ?? 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-1">Remaining Balance</p>
              <p className="text-lg font-semibold">€{((order.totalAmount ?? 0) - (order.depositAmount ?? 0)).toFixed(2)}</p>
            </div>
            {order.remainingDueDate && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-blue-700 mb-1">Remaining Balance Due</p>
                <p className="text-lg font-semibold">
                  {new Date(order.remainingDueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {order.trackingNumber && (
        <div className="rounded-lg border bg-white p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Shipping</h2>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tracking Number</p>
            <p className="font-mono text-sm bg-gray-50 px-3 py-2 rounded inline-block">{order.trackingNumber}</p>
          </div>
        </div>
      )}

      {order.shippingAddress && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-700">
            {order.shippingAddress.line1 && <p>{order.shippingAddress.line1}</p>}
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            {(order.shippingAddress.city || order.shippingAddress.state || order.shippingAddress.postalCode) && (
              <p>
                {order.shippingAddress.city}
                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
              </p>
            )}
            {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
          </div>
        </div>
      )}
    </main>
  )
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <OrderDetailContentWrapper params={params} />
    </Suspense>
  )
}

async function OrderDetailContentWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderDetailContent id={id} />
}
