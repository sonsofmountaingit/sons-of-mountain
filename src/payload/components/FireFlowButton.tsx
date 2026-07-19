'use client'

import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function FireFlowButton() {
  const { id } = useDocumentInfo()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [contextJson, setContextJson] = useState('{}')
  const [status, setStatus] = useState<string | null>(null)

  async function fire() {
    setStatus('Sending...')
    try {
      const context = contextJson.trim() ? JSON.parse(contextJson) : {}
      const res = await fetch(`/api/email-flows/${id}/fire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: email, context }),
      })
      const data = await res.json()
      setStatus(data.ok ? `Sent — subject: ${data.subject}` : `Failed: ${data.reason ?? data.error}`)
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (!id) return null

  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" className="btn btn--style-secondary" onClick={() => setOpen((o) => !o)}>
        Send Test / Fire Now
      </button>
      {open && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #333', borderRadius: 4 }}>
          <input
            type="email"
            placeholder="recipient@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: 8, padding: 6 }}
          />
          <textarea
            placeholder='{"tripTitle": "Rila 2026"}'
            value={contextJson}
            onChange={(e) => setContextJson(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: 8, padding: 6, fontFamily: 'monospace', fontSize: 12 }}
          />
          <button type="button" className="btn btn--style-primary" onClick={fire} disabled={!email}>
            Send
          </button>
          {status && <p style={{ marginTop: 8, fontSize: 12 }}>{status}</p>}
        </div>
      )}
    </div>
  )
}
