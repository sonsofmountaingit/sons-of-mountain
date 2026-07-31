'use client'

import { useCallback, useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientProps } from 'payload'

export function CancelOrderButton(props: UIFieldClientProps) {
  const { id, collectionSlug } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields?.status?.value) as string | undefined
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const isOrders = collectionSlug === 'orders'
  const isRegistrations = collectionSlug === 'registrations'

  const handleCancel = useCallback(async () => {
    if (!id || (!isOrders && !isRegistrations)) return
    if (!window.confirm('Cancel this order and refund the customer (if paid)? This cannot be undone.')) return

    setLoading(true)
    setMessage(null)
    try {
      const body = isOrders ? { orderId: id } : { registrationId: id }
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(`Error: ${data.error ?? 'Failed to cancel'}`)
        return
      }
      setMessage(
        data.refunded
          ? `Cancelled and refunded €${data.refundAmount}. Reload to see changes.`
          : 'Cancelled. Reload to see changes.',
      )
      window.location.reload()
    } catch (err) {
      setMessage(`Error: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }, [id, isOrders, isRegistrations])

  if (!id) return null
  if (status === 'cancelled') {
    return <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Already cancelled.</p>
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        style={{
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#fff',
          background: loading ? 'rgba(220,38,38,0.5)' : '#dc2626',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Cancelling…' : 'Cancel & Refund'}
      </button>
      {message && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{message}</p>
      )}
    </div>
  )
}
