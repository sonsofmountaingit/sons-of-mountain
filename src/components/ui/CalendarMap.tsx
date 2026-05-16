'use client'

import { useEffect, useRef } from 'react'
import type { CalendarItem } from './CalendarTripCard'

type Props = {
  items: CalendarItem[]
  itemCoords: Record<string, { lat: number; lng: number }>
}

export function CalendarMap({ items, itemCoords }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    let map: { remove: () => void } | null = null

    import('maplibre-gl').then((maplibregl) => {
      if (!mapRef.current) return

      map = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [25, 42],
        zoom: 5,
      })

      const ml = maplibregl

      for (const item of items) {
        const coords = itemCoords[item.id]
        if (!coords) continue

        const popup = new ml.Popup({ offset: 12 }).setHTML(`
          <div style="font-family:sans-serif;font-size:13px;max-width:200px">
            <strong>${item.title}</strong><br/>
            <span style="font-size:11px;color:#888">
              ${new Date(item.startDate).toLocaleDateString('bg-BG')} — ${new Date(item.endDate).toLocaleDateString('bg-BG')}
            </span><br/>
            ${item.spotsAvailable > 0 ? `<span style="font-size:11px">${item.spotsAvailable} места</span>` : '<span style="font-size:11px;color:#999">Няма места</span>'}<br/>
            <a href="${item.href}" style="font-size:11px;color:#3b82f6">Виж →</a>
          </div>
        `)

        new ml.Marker({ color: item.status === 'soldOut' ? '#6b7280' : item.category === 'individual' ? '#f59e0b' : '#3b82f6' })
          .setLngLat([coords.lng, coords.lat])
          .setPopup(popup)
          .addTo(map as Parameters<typeof ml.Marker.prototype.addTo>[0])
      }
    })

    return () => { map?.remove() }
  }, [items, itemCoords])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden border border-white/10"
      style={{ height: '500px' }}
    />
  )
}
