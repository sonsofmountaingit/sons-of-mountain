'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/use-translations'

export function GalleryKeyboardHints() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslations()
  const SHORTCUTS = [
    { key: 'G', label: t.gallery_extra.toggle_grid_map },
    { key: 'F', label: t.gallery_extra.favorite_image },
    { key: 'Esc', label: t.gallery_extra.close_lightbox },
  ]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) setOpen((v) => !v)
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-40 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/40 transition-colors text-xs font-mono"
        aria-label={t.a11y.keyboard_shortcuts}
      >
        ?
      </button>

      {open && (
        <div className="fixed bottom-16 left-6 z-40 bg-[#1a1a1a] border border-white/10 rounded-xl p-4 shadow-2xl min-w-[220px]">
          <p className="text-white/40 text-xs font-medium mb-3 tracking-widest">{t.gallery_extra.keyboard_shortcuts_title}</p>
          {SHORTCUTS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-6 py-1">
              <span className="text-white/60 text-xs">{label}</span>
              <kbd className="text-[10px] font-mono bg-white/10 text-white/70 px-1.5 py-0.5 rounded">{key}</kbd>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
