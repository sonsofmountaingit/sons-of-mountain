'use client'
import React, { useEffect, useState } from 'react'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created: string
  receiptUrl: string | null
}

interface Subscription {
  id: string
  status: string
  plan: string
  currentPeriodEnd: string | null
}

export function StripeManagementView() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [refundingId, setRefundingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/stripe/reconciliation').then((r) => r.json()),
    ]).then(([recon]) => {
      setPayments(
        (recon.orphaned ?? []).concat(
          (recon.ghosts ?? []).map((g: any) => ({ id: g.id, amount: g.amount, currency: 'eur', status: 'ghost', created: '', receiptUrl: null }))
        )
      )
      setLoading(false)
    }).catch(() => setLoading(false))

    fetch('/api/payload/subscriptions?limit=20&where[status][equals]=active')
      .then((r) => r.json())
      .then((data) => setSubscriptions(data.docs ?? []))
      .catch(() => {})
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading Stripe data...</div>

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: 8 }}>Stripe Management</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <a
          href="https://dashboard.stripe.com/payments"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '8px 16px', background: '#635bff', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
        >
          Open Stripe Dashboard
        </a>
        <a
          href="/admin/stripe-reconciliation"
          style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
        >
          Reconciliation Report
        </a>
      </div>

      <h3>Active Subscriptions ({subscriptions.length})</h3>
      {subscriptions.length === 0 ? (
        <p style={{ color: '#888' }}>No active subscriptions.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Plan</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Renews</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{s.id}</td>
                <td style={{ padding: 8 }}>{s.plan}</td>
                <td style={{ padding: 8 }}>{s.status}</td>
                <td style={{ padding: 8 }}>{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Anomalies &amp; Ghost Orders</h3>
      {payments.length === 0 ? (
        <p style={{ color: '#22c55e' }}>No anomalies detected.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fef2f2' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #fee2e2' }}>
                <td style={{ padding: 8 }}>{p.id}</td>
                <td style={{ padding: 8 }}>€{p.amount?.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
