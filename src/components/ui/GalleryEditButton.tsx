'use client'

import { useEffect, useState } from 'react'

export function GalleryEditButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.role === 'admin' || data?.user?.role === 'editor') setIsAdmin(true)
      })
      .catch(() => {})
  }, [])

  if (!isAdmin) return null

  return (
    <a
      href="/puck/gallery"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#e05a2b] hover:bg-[#c94e22] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-colors duration-200"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Edit Gallery
    </a>
  )
}
