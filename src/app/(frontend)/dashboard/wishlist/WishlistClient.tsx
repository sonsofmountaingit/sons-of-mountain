'use client'

import { useState } from 'react'
import Link from 'next/link'

type WishlistItem = {
  itemType: 'trip' | 'program'
  trip?: { id: string; title?: string; startDate?: string; endDate?: string; price?: number; currency?: string } | string
  program?: { id: string; title?: string; startDate?: string; endDate?: string; price?: number; currency?: string } | string
}

export function WishlistClient({ wishlist: initial }: { wishlist: unknown[] }) {
  const [items, setItems] = useState<WishlistItem[]>(initial as WishlistItem[])

  async function remove(itemType: 'trip' | 'program', id: string) {
    setItems((prev) => prev.filter((w) => {
      const wid = itemType === 'trip'
        ? (typeof w.trip === 'object' ? w.trip?.id : w.trip)
        : (typeof w.program === 'object' ? w.program?.id : w.program)
      return !(w.itemType === itemType && wid === id)
    }))
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType, id }),
    })
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-white/30">
        <p className="text-lg">Нямате запазени любими.</p>
        <Link href="/calendar" className="mt-4 inline-block text-sm underline text-white/50 hover:text-white">
          Разгледай календара
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-6">Любими</h2>
      {items.map((item, i) => {
        const doc = item.itemType === 'trip' ? item.trip : item.program
        if (!doc || typeof doc === 'string') return null
        const id = doc.id
        const href = item.itemType === 'trip' ? `/destinations/${id}` : `/programs/${id}`
        return (
          <div key={i} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div>
              <span className="text-[10px] tracking-widest text-white/30 uppercase">
                {item.itemType === 'trip' ? 'ПЪТУВАНЕ' : 'ПРОГРАМА'}
              </span>
              <p className="font-medium mt-0.5">{doc.title ?? id}</p>
              {doc.startDate && (
                <p className="text-xs text-white/40 mt-0.5">
                  {new Date(doc.startDate).toLocaleDateString('bg-BG')}
                  {doc.endDate ? ` — ${new Date(doc.endDate).toLocaleDateString('bg-BG')}` : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link href={href} className="text-xs text-white/50 hover:text-white underline">
                Виж
              </Link>
              <button
                onClick={() => remove(item.itemType, id)}
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
                aria-label="Премахни от любими"
              >
                ✕
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
