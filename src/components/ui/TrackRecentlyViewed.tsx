'use client'

import { useEffect } from 'react'

export function TrackRecentlyViewed({ id }: { id: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem('som_recent')
      const ids: string[] = raw ? JSON.parse(raw) : []
      const filtered = ids.filter((i) => i !== id)
      localStorage.setItem('som_recent', JSON.stringify([id, ...filtered].slice(0, 10)))
    } catch {}
  }, [id])

  return null
}
