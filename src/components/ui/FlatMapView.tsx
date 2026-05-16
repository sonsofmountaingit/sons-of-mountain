'use client'

import { useEffect, useRef, useState } from 'react'
import type { CalendarItem } from './CalendarTripCard'
import 'maplibre-gl/dist/maplibre-gl.css'

type Participant = { initials: string; color: string }
type ParticipantData = Record<string, { count: number; participants: Participant[] }>

type Props = {
  items: CalendarItem[]
  itemCoords: Record<string, { lat: number; lng: number }>
  participants?: ParticipantData
}

type ModalState = { item: CalendarItem; pd: { count: number; participants: Participant[] } } | null

function pinColor(item: CalendarItem): string {
  if (item.status === 'soldOut') return '#6b7280'
  if (item.category === 'individual') return '#f59e0b'
  return '#3b82f6'
}

function makePinEl(item: CalendarItem, pdata: ParticipantData, onClick: (it: CalendarItem) => void): HTMLElement {
  const color = pinColor(item)
  const pd = pdata[item.id] ?? { count: 0, participants: [] }

  const wrap = document.createElement('div')
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;'
  wrap.addEventListener('click', (e) => { e.stopPropagation(); onClick(item) })

  if (pd.participants.length > 0) {
    const row = document.createElement('div')
    row.style.cssText = 'display:flex;align-items:center;margin-bottom:2px;'
    pd.participants.forEach((p, i) => {
      const b = document.createElement('div')
      b.style.cssText = `width:18px;height:18px;border-radius:50%;background:${p.color};border:1.5px solid #000;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#fff;margin-left:${i === 0 ? 0 : -4}px;z-index:${10-i};position:relative;font-family:sans-serif;flex-shrink:0;`
      b.textContent = p.initials
      row.appendChild(b)
    })
    if (pd.count > pd.participants.length) {
      const x = document.createElement('div')
      x.style.cssText = `width:18px;height:18px;border-radius:50%;background:#374151;border:1.5px solid #000;display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:700;color:#fff;margin-left:-4px;position:relative;z-index:0;font-family:sans-serif;flex-shrink:0;`
      x.textContent = `+${pd.count - pd.participants.length}`
      row.appendChild(x)
    }
    wrap.appendChild(row)
  }

  const circle = document.createElement('div')
  circle.style.cssText = `width:34px;height:34px;border-radius:50%;background:${color};border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.5);`
  const img = document.createElement('img')
  img.src = '/white-logo.svg'; img.width = 20; img.height = 20
  img.style.cssText = 'display:block;pointer-events:none;'; img.draggable = false
  circle.appendChild(img)

  const tail = document.createElement('div')
  tail.style.cssText = `width:2px;height:7px;background:${color};margin-top:-1px;border-radius:0 0 2px 2px;`

  wrap.appendChild(circle)
  wrap.appendChild(tail)
  return wrap
}

function PinModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  if (!state) return null
  const { item, pd } = state
  const color = pinColor(item)
  const kind = item.kind === 'trip' ? 'ПЪТУВАНЕ' : item.kind === 'program' ? 'ПРОГРАМА' : 'ИНДИВИДУАЛНО'
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }} />
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(360px,92vw)', background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, overflow: 'hidden', fontFamily: 'ui-sans-serif,system-ui,sans-serif', color: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.8)' }}>
        {item.imageUrl && (
          <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent,#111)' }} />
          </div>
        )}
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
        <div style={{ padding: '14px 18px 28px' }}>
          <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 9px', borderRadius: 999, marginBottom: 8, background: `${color}22`, color, border: `1px solid ${color}44` }}>{kind}</div>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 5 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>{item.destinationName}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>{new Date(item.startDate).toLocaleDateString('bg-BG')} — {new Date(item.endDate).toLocaleDateString('bg-BG')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: item.spotsAvailable > 0 ? '#86efac' : '#f87171' }}>
              {item.spotsAvailable > 0 ? `${item.spotsAvailable} / ${item.spotsTotal} места` : 'Изчерпано'}
            </div>
            {pd.count > 0 && <><span style={{ color: '#374151' }}>·</span><div style={{ fontSize: 11, color: '#6b7280' }}>{pd.count} регистрирани</div></>}
          </div>
          {item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {item.tags.slice(0, 4).map((t, i) => <span key={`${t}-${i}`} style={{ fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>{t.toUpperCase()}</span>)}
            </div>
          )}
          <a href={item.href} style={{ display: 'block', textAlign: 'center', background: '#3b82f6', color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 13, textDecoration: 'none', fontWeight: 700 }}>Виж програмата →</a>
        </div>
      </div>
    </>
  )
}

export function FlatMapView({ items, itemCoords, participants = {} }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<ModalState>(null)

  function openModal(item: CalendarItem) {
    const pd = participants[item.id] ?? { count: 0, participants: [] }
    setModal({ item, pd })
  }

  useEffect(() => {
    if (!mapRef.current) return
    let destroyed = false
    let map: { remove: () => void } | null = null

    import('maplibre-gl').then((ml) => {
      if (destroyed || !mapRef.current) return

      const m = new ml.Map({
        container: mapRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [25, 42],
        zoom: 5,
        attributionControl: false,
      })
      map = m

      m.on('load', () => {
        m.resize()
        // Add pins as native MapLibre markers — they live INSIDE the map container
        // so they scroll/zoom with the map and clicks work natively
        for (const item of items) {
          const coords = itemCoords[item.id]
          if (!coords) continue
          const el = makePinEl(item, participants, openModal)
          new ml.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([coords.lng, coords.lat])
            .addTo(m)
        }
      })
    })

    return () => {
      destroyed = true
      map?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, itemCoords])

  return (
    <>
      <style>{`
        .flat-map-canvas-wrap canvas { filter: grayscale(1) sepia(0.4) hue-rotate(5deg) brightness(0.88) contrast(1.1); }
        .maplibregl-marker { filter: none !important; }
      `}</style>
      <div className="relative w-full rounded-xl border border-white/10" style={{ height: 'clamp(360px,65vw,600px)', overflow: 'hidden' }}>
        <div ref={mapRef} className="flat-map-canvas-wrap" style={{ width: '100%', height: '100%' }} />
        <PinModal state={modal} onClose={() => setModal(null)} />
      </div>
    </>
  )
}
