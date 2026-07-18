'use client'

import { useCallback, useRef, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

export function HeroImageFocalPointField(props: TextFieldClientProps) {
  const { path } = props
  const isX = path.endsWith('X')
  const yPath = isX ? path.replace(/X$/, 'Y') : path
  const xPath = isX ? path : path.replace(/Y$/, 'X')

  const { value: xValue, setValue: setXValue } = useField<number>({ path: xPath })
  const { value: yValue, setValue: setYValue } = useField<number>({ path: yPath })

  const imageDoc = useFormFields(([fields]) => fields?.heroImage?.value) as any
  const imageUrl: string | undefined =
    typeof imageDoc === 'object' && imageDoc ? imageDoc.url ?? imageDoc.thumbnailURL : undefined

  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const x = typeof xValue === 'number' ? xValue : 50
  const y = typeof yValue === 'number' ? yValue : 50

  const updateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const nextX = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
      const nextY = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100))
      setXValue(Math.round(nextX))
      setYValue(Math.round(nextY))
    },
    [setXValue, setYValue],
  )

  // Only render once, for the X field; Y field renders nothing (handled together)
  if (!isX) return null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
        Hero Image Focal Point
      </label>
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setDragging(true)
          updateFromEvent(e.clientX, e.clientY)
        }}
        onMouseMove={(e) => {
          if (dragging) updateFromEvent(e.clientX, e.clientY)
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => {
          setDragging(true)
          const t = e.touches[0]
          if (t) updateFromEvent(t.clientX, t.clientY)
        }}
        onTouchMove={(e) => {
          const t = e.touches[0]
          if (t) updateFromEvent(t.clientX, t.clientY)
        }}
        onTouchEnd={() => setDragging(false)}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          aspectRatio: '16 / 9',
          borderRadius: 8,
          overflow: 'hidden',
          background: imageUrl ? `url(${imageUrl}) center / cover no-repeat` : '#1a1a1a',
          cursor: 'crosshair',
          userSelect: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {!imageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
            }}
          >
            Upload a hero image to set focal point
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid #ffffff',
            background: 'rgba(232, 80, 26, 0.9)',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        />
      </div>
      <p style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        Drag the dot to set the focus point ({x}%, {y}%).
      </p>
    </div>
  )
}
