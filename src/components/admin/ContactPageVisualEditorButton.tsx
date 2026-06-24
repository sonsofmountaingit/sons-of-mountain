'use client'

export function ContactPageVisualEditorButton() {
  return (
    <a
      href="/puck/contact"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 16px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 6, color: '#ffffff', fontWeight: 600, fontSize: 13, textDecoration: 'none',
      }}
    >
      Open Visual Editor
    </a>
  )
}
