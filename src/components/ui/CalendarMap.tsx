'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { CalendarItem } from './CalendarTripCard'

type ParticipantData = Record<string, { count: number; participants: { initials: string; color: string }[] }>

type Props = {
  items: CalendarItem[]
  itemCoords: Record<string, { lat: number; lng: number }>
}

const GlobeView = dynamic(() => import('./GlobeView').then((m) => ({ default: m.GlobeView })), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
})

const FlatMapView = dynamic(() => import('./FlatMapView').then((m) => ({ default: m.FlatMapView })), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl bg-neutral-900 animate-pulse"
      style={{ height: 'clamp(360px,65vw,600px)' }}
    />
  ),
})

function GlobePlaceholder() {
  return (
    <div
      className="w-full rounded-xl border border-white/10 bg-black flex items-center justify-center"
      style={{ height: 'clamp(360px,65vw,600px)' }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, #1d4ed8 0%, #1e3a5f 40%, #0a0f1e 80%)',
          boxShadow: '0 0 80px rgba(59,130,246,0.25), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  )
}

export function CalendarMap({ items, itemCoords }: Props) {
  const [mode, setMode] = useState<'globe' | 'flat'>('globe')
  const [flatMounted, setFlatMounted] = useState(false)
  const [participants, setParticipants] = useState<ParticipantData>({})

  useEffect(() => {
    if (items.length === 0) return
    const ids = items.map((i) => i.id).join(',')
    fetch(`/api/calendar-participants?ids=${ids}`)
      .then((r) => r.json())
      .then(setParticipants)
      .catch(() => {})
  }, [items])

  function switchToFlat() {
    setFlatMounted(true)
    setMode('flat')
  }

  return (
    <div className="relative w-full mb-8">
      {/* Toggle pill */}
      <div
        className="absolute top-4 right-4 z-10 flex rounded-full p-1 gap-0.5"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <button
          onClick={() => setMode('globe')}
          style={{
            background: mode === 'globe' ? '#fff' : 'transparent',
            color: mode === 'globe' ? '#111' : 'rgba(255,255,255,0.6)',
            borderRadius: '9999px',
            padding: '6px 16px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            minWidth: 60,
            minHeight: 36,
            transition: 'all 0.2s',
            letterSpacing: '0.05em',
          }}
        >
          GLOBE
        </button>
        <button
          onClick={switchToFlat}
          style={{
            background: mode === 'flat' ? '#fff' : 'transparent',
            color: mode === 'flat' ? '#111' : 'rgba(255,255,255,0.6)',
            borderRadius: '9999px',
            padding: '6px 16px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            minWidth: 60,
            minHeight: 36,
            transition: 'all 0.2s',
            letterSpacing: '0.05em',
          }}
        >
          MAP
        </button>
      </div>

      {/* Globe — always mounted while globe mode or before switching */}
      <div style={{ display: mode === 'globe' ? 'block' : 'none' }}>
        <GlobeView items={items} itemCoords={itemCoords} participants={participants} />
      </div>

      {/* Flat map — only mounted after first click to save initial bundle */}
      {flatMounted && (
        <div style={{ display: mode === 'flat' ? 'block' : 'none' }}>
          <FlatMapView items={items} itemCoords={itemCoords} participants={participants} />
        </div>
      )}
    </div>
  )
}
