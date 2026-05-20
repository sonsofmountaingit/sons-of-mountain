'use client'
import React, { useEffect, useState } from 'react'

interface Summary { stripeTotal: number; payloadTotal: number; diff: number }
interface Ghost { id: string; email: string; amount: number; type: string; note?: string }
interface Mismatch { id: string; email: string; payloadAmount: number; stripeAmount: number; diff: number }
interface Orphaned { paymentIntentId: string; amount: number; date: string }
interface Payout { id: string; amount: number; currency: string; arrivalDate: string; status: string }

export function StripeReconciliationView() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [ghosts, setGhosts] = useState<Ghost[]>([])
  const [mismatches, setMismatches] = useState<Mismatch[]>([])
  const [orphaned, setOrphaned] = useState<Orphaned[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stripe/reconciliation')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setSummary(data.summary)
        setGhosts(data.ghosts ?? [])
        setMismatches(data.mismatches ?? [])
        setOrphaned(data.orphaned ?? [])
        setPayouts(data.payouts ?? [])
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading reconciliation data...</div>
  if (error) return <div style={{ padding: 24, color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Revenue Reconciliation</h2>

      {summary && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, minWidth: 160 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Stripe Total</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>€{summary.stripeTotal.toFixed(2)}</div>
          </div>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, minWidth: 160 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Payload Total</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>€{summary.payloadTotal.toFixed(2)}</div>
          </div>
          <div style={{ padding: 16, background: Math.abs(summary.diff) < 0.01 ? '#f0fdf4' : '#fef2f2', borderRadius: 8, minWidth: 160 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Difference</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: Math.abs(summary.diff) < 0.01 ? '#16a34a' : '#dc2626' }}>
              €{summary.diff.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <h3>Recent Payouts ({payouts.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 24 }}>
        <thead><tr style={{ background: '#f3f4f6' }}>
          <th style={{ padding: 8, textAlign: 'left' }}>Date</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
        </tr></thead>
        <tbody>{payouts.map((p) => (
          <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: 8 }}>{new Date(p.arrivalDate).toLocaleDateString()}</td>
            <td style={{ padding: 8 }}>€{p.amount.toFixed(2)}</td>
            <td style={{ padding: 8 }}>{p.status}</td>
          </tr>
        ))}</tbody>
      </table>

      {ghosts.length > 0 && (
        <>
          <h3 style={{ color: '#dc2626' }}>Ghost Orders — paid in Payload, no Stripe charge ({ghosts.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 24 }}>
            <thead><tr style={{ background: '#fef2f2' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Email</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Note</th>
            </tr></thead>
            <tbody>{ghosts.map((g) => (
              <tr key={g.id} style={{ borderBottom: '1px solid #fee2e2' }}>
                <td style={{ padding: 8 }}><a href={`/admin/collections/orders/${g.id}`}>{g.id}</a></td>
                <td style={{ padding: 8 }}>{g.email}</td>
                <td style={{ padding: 8 }}>€{g.amount?.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{g.note ?? '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </>
      )}

      {mismatches.length > 0 && (
        <>
          <h3 style={{ color: '#d97706' }}>Amount Mismatches ({mismatches.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 24 }}>
            <thead><tr style={{ background: '#fffbeb' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Email</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Payload €</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Stripe €</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Diff</th>
            </tr></thead>
            <tbody>{mismatches.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #fde68a' }}>
                <td style={{ padding: 8 }}><a href={`/admin/collections/orders/${m.id}`}>{m.id}</a></td>
                <td style={{ padding: 8 }}>{m.email}</td>
                <td style={{ padding: 8 }}>€{m.payloadAmount?.toFixed(2)}</td>
                <td style={{ padding: 8 }}>€{m.stripeAmount?.toFixed(2)}</td>
                <td style={{ padding: 8, color: m.diff > 0 ? '#16a34a' : '#dc2626' }}>€{m.diff?.toFixed(2)}</td>
              </tr>
            ))}</tbody>
          </table>
        </>
      )}

      {orphaned.length > 0 && (
        <>
          <h3 style={{ color: '#7c3aed' }}>Orphaned Stripe Charges — no matching Payload order ({orphaned.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f5f3ff' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Payment Intent</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Date</th>
            </tr></thead>
            <tbody>{orphaned.map((o) => (
              <tr key={o.paymentIntentId} style={{ borderBottom: '1px solid #ede9fe' }}>
                <td style={{ padding: 8 }}>{o.paymentIntentId}</td>
                <td style={{ padding: 8 }}>€{o.amount?.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{o.date ? new Date(o.date).toLocaleDateString() : '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </>
      )}

      {ghosts.length === 0 && mismatches.length === 0 && orphaned.length === 0 && (
        <p style={{ color: '#16a34a', fontWeight: 600 }}>No discrepancies found.</p>
      )}
    </div>
  )
}
