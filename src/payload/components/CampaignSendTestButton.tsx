'use client'

import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function CampaignSendTestButton() {
  const { id } = useDocumentInfo()
  const [status, setStatus] = useState<string | null>(null)

  async function sendTest() {
    setStatus('Sending...')
    try {
      const res = await fetch(`/api/campaigns/${id}/test`, { method: 'POST' })
      const data = await res.json()
      setStatus(res.ok ? `Sent — subject: ${data.subject}` : `Failed: ${data.error}`)
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (!id) return null

  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" className="btn btn--style-secondary" onClick={sendTest}>
        Send Test
      </button>
      {status && <p style={{ marginTop: 8, fontSize: 12 }}>{status}</p>}
    </div>
  )
}
