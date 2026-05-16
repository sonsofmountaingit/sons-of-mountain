'use client'

import { useEffect, useRef, useState } from 'react'
import type { CalendarItem } from './CalendarTripCard'

type Participant = { initials: string; color: string }
type ParticipantData = Record<string, { count: number; participants: Participant[] }>

type Props = {
  items: CalendarItem[]
  itemCoords: Record<string, { lat: number; lng: number }>
  participants: ParticipantData
}

type PinDatum = CalendarItem & { lat: number; lng: number }
type ArcDatum = { slat: number; slng: number; elat: number; elng: number }
type ModalState = { item: CalendarItem; pd: { count: number; participants: Participant[] } } | null

function pinColor(item: CalendarItem): string {
  if (item.status === 'soldOut') return '#6b7280'
  if (item.category === 'individual') return '#f59e0b'
  return '#3b82f6'
}

function buildPinEl(
  item: CalendarItem,
  pdata: ParticipantData,
  onClick: (item: CalendarItem) => void,
): HTMLElement {
  const color = pinColor(item)
  const pd = pdata[item.id] ?? { count: 0, participants: [] }

  const wrapper = document.createElement('div')
  wrapper.style.cssText =
    'cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;user-select:none;pointer-events:all;'
  wrapper.addEventListener('click', (e) => {
    e.stopPropagation()
    e.preventDefault()
    onClick(item)
  })

  if (pd.participants.length > 0) {
    const bubbleRow = document.createElement('div')
    bubbleRow.style.cssText = 'display:flex;align-items:center;margin-bottom:2px;'
    pd.participants.forEach((p, i) => {
      const bubble = document.createElement('div')
      bubble.style.cssText = `width:20px;height:20px;border-radius:50%;background:${p.color};border:1.5px solid rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#fff;margin-left:${i === 0 ? 0 : -5}px;position:relative;z-index:${10 - i};font-family:ui-sans-serif,system-ui,sans-serif;flex-shrink:0;`
      bubble.textContent = p.initials
      bubbleRow.appendChild(bubble)
    })
    if (pd.count > pd.participants.length) {
      const extra = document.createElement('div')
      extra.style.cssText = `width:20px;height:20px;border-radius:50%;background:#374151;border:1.5px solid rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:700;color:#fff;margin-left:-5px;position:relative;z-index:0;font-family:ui-sans-serif,system-ui,sans-serif;flex-shrink:0;`
      extra.textContent = `+${pd.count - pd.participants.length}`
      bubbleRow.appendChild(extra)
    }
    wrapper.appendChild(bubbleRow)
  }

  const logoCircle = document.createElement('div')
  logoCircle.style.cssText = `width:36px;height:36px;border-radius:50%;background:${color};border:2.5px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.7),0 0 0 1px rgba(0,0,0,0.3);`
  const img = document.createElement('img')
  img.src = '/white-logo.svg'
  img.width = 22
  img.height = 22
  img.style.cssText = 'display:block;object-fit:contain;pointer-events:none;'
  img.draggable = false
  logoCircle.appendChild(img)

  const tail = document.createElement('div')
  tail.style.cssText = `width:2px;height:8px;background:${color};border-radius:0 0 2px 2px;margin-top:-1px;box-shadow:0 2px 6px rgba(0,0,0,0.6);`

  wrapper.appendChild(logoCircle)
  wrapper.appendChild(tail)
  return wrapper
}

function PinModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  if (!state) return null
  const { item, pd } = state
  const color = pinColor(item)
  const kindLabel =
    item.kind === 'trip' ? 'ПЪТУВАНЕ' : item.kind === 'program' ? 'ПРОГРАМА' : 'ИНДИВИДУАЛНО'

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          zIndex: 9999,
          width: 'min(360px, 92vw)',
          background: '#111',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          overflow: 'hidden',
          fontFamily: 'ui-sans-serif,system-ui,sans-serif',
          color: '#fff',
          boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
        }}
      >
        {item.imageUrl && (
          <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
            <img
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent,#111)' }} />
          </div>
        )}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
        >✕</button>

        <div style={{ padding: '14px 18px 24px' }}>
          <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 9px', borderRadius: 999, marginBottom: 8, background: `${color}22`, color, border: `1px solid ${color}44` }}>
            {kindLabel}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 5 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>{item.destinationName}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
            {new Date(item.startDate).toLocaleDateString('bg-BG')} — {new Date(item.endDate).toLocaleDateString('bg-BG')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: item.spotsAvailable > 0 ? '#86efac' : '#f87171' }}>
              {item.spotsAvailable > 0 ? `${item.spotsAvailable} / ${item.spotsTotal} места` : 'Изчерпано'}
            </div>
            {pd.count > 0 && (
              <>
                <span style={{ color: '#374151' }}>·</span>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{pd.count} регистрирани</div>
              </>
            )}
          </div>

          {item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {item.tags.slice(0, 4).map((t, ti) => (
                <span key={`${t}-${ti}`} style={{ fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          <a
            href={item.href}
            style={{ display: 'block', textAlign: 'center', background: '#3b82f6', color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 13, textDecoration: 'none', fontWeight: 700, letterSpacing: '0.02em' }}
          >
            Виж програмата →
          </a>
        </div>
      </div>
    </>
  )
}

export function GlobeView({ items, itemCoords, participants }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<ModalState>(null)
  // stable ref so useEffect doesn't re-run when participants changes
  const participantsRef = useRef(participants)
  participantsRef.current = participants

  useEffect(() => {
    if (!containerRef.current) return

    const el = containerRef.current
    let destroyed = false

    const isMobile = window.innerWidth < 768

    const pinData: PinDatum[] = items
      .filter((it) => itemCoords[it.id])
      .map((it) => ({ ...it, lat: itemCoords[it.id].lat, lng: itemCoords[it.id].lng }))

    const arcData: ArcDatum[] = []
    for (let i = 0; i < pinData.length - 1; i++) {
      arcData.push({
        slat: pinData[i].lat, slng: pinData[i].lng,
        elat: pinData[i + 1].lat, elng: pinData[i + 1].lng,
      })
    }

    import('globe.gl').then(({ default: Globe }) => {
      if (destroyed || !el) return

      const globe = new Globe(el, { rendererConfig: { antialias: true, alpha: true } })

      globe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .htmlElementsData(pinData)
        .htmlLat((d: object) => (d as PinDatum).lat)
        .htmlLng((d: object) => (d as PinDatum).lng)
        .htmlAltitude(0.02)
        .htmlElement((d: object) => {
          const item = d as PinDatum
          return buildPinEl(item, participantsRef.current, (clicked) => {
            const pd = participantsRef.current[clicked.id] ?? { count: 0, participants: [] }
            setModal({ item: clicked, pd })
          })
        })

      if (!isMobile && arcData.length > 0) {
        globe
          .arcsData(arcData)
          .arcStartLat((d: object) => (d as ArcDatum).slat)
          .arcStartLng((d: object) => (d as ArcDatum).slng)
          .arcEndLat((d: object) => (d as ArcDatum).elat)
          .arcEndLng((d: object) => (d as ArcDatum).elng)
          .arcColor(() => ['rgba(59,130,246,0)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0)'])
          .arcAltitude(0.3)
          .arcDashLength(0.4)
          .arcDashGap(0.15)
          .arcDashAnimateTime(1800)
          .arcStroke(() => 0.5)
      }

      globe.pointOfView({ lat: 42, lng: 25, altitude: isMobile ? 2.8 : 2.2 }, 0)
      globe.width(el.clientWidth).height(el.clientHeight)

      const controls = globe.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.5
      controls.enableZoom = true
      controls.addEventListener('start', () => { controls.autoRotate = false })

      const ro = new ResizeObserver(() => {
        globe.width(el.clientWidth).height(el.clientHeight)
      })
      ro.observe(el)

      ;(el as HTMLElement & { _globeCleanup?: () => void })._globeCleanup = () => {
        ro.disconnect()
        globe._destructor()
      }
    })

    return () => {
      destroyed = true
      const cleanup = (el as HTMLElement & { _globeCleanup?: () => void })._globeCleanup
      cleanup?.()
    }
  }, [items, itemCoords])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden border border-white/10"
      style={{ height: 'clamp(360px, 65vw, 600px)', background: '#000' }}
    >
      <PinModal state={modal} onClose={() => setModal(null)} />
    </div>
  )
}
