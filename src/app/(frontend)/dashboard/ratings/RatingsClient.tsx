'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'

interface Rating {
  id: string
  rating: number
  review?: string
  destination?: { id: string; name?: string }
  trip?: { id: string; title?: string }
  createdAt: string
}

interface Destination { id: string; name: string }
interface Trip { id: string; title: string }

interface Props {
  initialRatings: Rating[]
  destinations: Destination[]
  trips: Trip[]
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={[
            'text-xl leading-none transition-colors',
            (hovered || value) >= n ? 'text-white' : 'text-white/20',
            onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default',
          ].join(' ')}
          aria-label={`${n} звезди`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function RatingsClient({ initialRatings, destinations, trips }: Props) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ destinationId: '', tripId: '', rating: 0, review: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rating-item', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' })
    }, gridRef)
    return () => ctx.revert()
  }, [ratings.length])

  async function handleSubmit() {
    setError('')
    if (!form.rating) { setError('Избери оценка от 1 до 5.'); return }
    if (!form.destinationId && !form.tripId) { setError('Избери дестинация или пътуване.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/customer-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: form.destinationId || undefined,
          tripId: form.tripId || undefined,
          rating: form.rating,
          review: form.review || undefined,
        }),
      })
      if (!res.ok) {
        const e = await res.json()
        setError(e.error ?? 'Грешка')
        return
      }
      const refreshed = await fetch('/api/customer-ratings')
      if (refreshed.ok) {
        const data = await refreshed.json()
        setRatings(data.docs ?? [])
      }
      setModalOpen(false)
      setForm({ destinationId: '', tripId: '', rating: 0, review: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const label = (r: Rating) => r.destination?.name ?? r.trip?.title ?? 'Неизвестно'

  return (
    <div className="px-6 lg:px-10 py-10 pb-24 lg:pb-10 max-w-2xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light tracking-wider">Моите оценки</h1>
          <p className="text-xs text-white/40 mt-1">{ratings.length} оценки</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors px-5 py-2.5 rounded-sm"
        >
          + ОЦЕНИ
        </button>
      </div>

      {ratings.length === 0 ? (
        <div className="border border-white/10 rounded-sm py-24 flex flex-col items-center gap-4 text-center">
          <p className="text-white/30 text-sm tracking-wider">Нямаш оценки все още.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-white/50 hover:text-white transition-colors border border-white/15 px-4 py-2 rounded-sm"
          >
            Оцени първото си пътуване
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="flex flex-col gap-3">
          {ratings.map((r) => (
            <div key={r.id} className="rating-item border border-white/10 rounded-sm px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/80 mb-1">{label(r)}</p>
                <Stars value={r.rating} />
                {r.review && <p className="text-xs text-white/40 mt-2 leading-relaxed">{r.review}</p>}
                <p className="text-xs text-white/25 mt-2">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString('bg-BG') : ''}
                </p>
              </div>
              <div className="text-2xl font-light text-white/30 flex-shrink-0">{r.rating}/5</div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm tracking-widest uppercase text-white/80">Добави оценка</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/40 tracking-widest">ДЕСТИНАЦИЯ</label>
                <select
                  value={form.destinationId}
                  onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value, tripId: '' }))}
                  className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white appearance-none"
                >
                  <option value="">— Избери —</option>
                  {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/40 tracking-widest">ИЛИ ПЪТУВАНЕ</label>
                <select
                  value={form.tripId}
                  onChange={(e) => setForm((f) => ({ ...f, tripId: e.target.value, destinationId: '' }))}
                  className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white appearance-none"
                >
                  <option value="">— Избери —</option>
                  {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 tracking-widest">ОЦЕНКА</label>
                <Stars value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/40 tracking-widest">ОТЗИВ (НЕЗАДЪЛЖИТЕЛНО)</label>
                <textarea
                  value={form.review}
                  onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                  rows={3}
                  placeholder="Сподели впечатленията си..."
                  className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white resize-none placeholder:text-white/20"
                />
              </div>
            </div>

            {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="flex-1 text-xs tracking-widest border border-white/15 text-white/40 hover:text-white/70 transition-colors py-2.5 rounded-sm disabled:opacity-50"
              >
                ОТКАЗ
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 text-xs tracking-widest bg-white text-black hover:bg-white/90 transition-colors py-2.5 rounded-sm disabled:opacity-40"
              >
                {submitting ? '...' : 'ЗАПАЗИ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
