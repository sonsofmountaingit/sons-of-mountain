'use client'

export function ShopVisualEditorButton() {
  return (
    <a
      href="/puck/shop"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 16px',
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 6,
        color: '#ffffff',
        fontWeight: 600,
        fontSize: 13,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#2a2a2a' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a1a' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      Open Visual Editor
    </a>
  )
}
