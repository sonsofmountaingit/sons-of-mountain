'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'

interface MediaItem {
  id: string
  mediaType: 'image' | 'video'
  file: { url?: string; filename?: string; width?: number; height?: number }
  destination?: { name?: string }
  trip?: { title?: string }
  caption?: string
  takenAt?: string
  seoAlt?: string
  seoTitle?: string
  status: 'pending' | 'approved' | 'rejected'
}

interface Destination { id: string; name: string }
interface Trip { id: string; title: string }

interface Props {
  initialMedia: MediaItem[]
  destinations: Destination[]
  trips: Trip[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Чакащо одобрение',
  approved: 'Одобрено',
  rejected: 'Отказано',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400',
}

export function MediaClient({ initialMedia, destinations, trips }: Props) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    destinationId: '',
    tripId: '',
    caption: '',
    takenAt: '',
    seoAlt: '',
    seoTitle: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.media-item', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' })
    }, gridRef)
    return () => ctx.revert()
  }, [media.length])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setError('')
    setUploading(true)
    setProgress(0)

    const fd = new FormData()
    fd.append('file', file)
    if (form.destinationId) fd.append('destination', form.destinationId)
    if (form.tripId) fd.append('trip', form.tripId)
    if (form.caption) fd.append('caption', form.caption)
    if (form.takenAt) fd.append('takenAt', form.takenAt)
    if (form.seoAlt) fd.append('seoAlt', form.seoAlt)
    if (form.seoTitle) fd.append('seoTitle', form.seoTitle)

    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
    }

    await new Promise<void>((resolve, reject) => {
      xhr.open('POST', '/api/customer-media')
      xhr.onload = () => {
        if (xhr.status === 201) {
          resolve()
        } else {
          try {
            const err = JSON.parse(xhr.responseText)
            reject(new Error(err.error ?? 'Upload failed'))
          } catch {
            reject(new Error('Upload failed'))
          }
        }
      }
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.send(fd)
    }).catch((e: Error) => {
      setError(e.message)
    })

    setUploading(false)
    setProgress(0)

    const res = await fetch('/api/customer-media')
    if (res.ok) {
      const data = await res.json()
      setMedia(data.docs ?? [])
    }

    setModalOpen(false)
    setFile(null)
    setForm({ destinationId: '', tripId: '', caption: '', takenAt: '', seoAlt: '', seoTitle: '' })
  }

  const mediaUrl = (item: MediaItem) => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
    return item.file?.url ?? `${base}/media/${item.file?.filename ?? ''}`
  }

  return (
    <div className="px-6 lg:px-10 py-10 pb-24 lg:pb-10">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light tracking-wider">Моята медия</h1>
          <p className="text-xs text-white/40 mt-1">{media.length} файла</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors px-5 py-2.5 rounded-sm"
        >
          + КАЧИ
        </button>
      </div>

      {media.length === 0 ? (
        <div className="border border-white/10 rounded-sm py-24 flex flex-col items-center gap-4 text-center">
          <p className="text-white/30 text-sm tracking-wider">Нямаш качени снимки или видеа.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-white/50 hover:text-white transition-colors border border-white/15 px-4 py-2 rounded-sm"
          >
            Качи първата си снимка
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.map((item) => (
            <div key={item.id} className="media-item group relative rounded-sm overflow-hidden bg-white/5 aspect-square">
              {item.mediaType === 'image' ? (
                <Image
                  src={mediaUrl(item)}
                  alt={item.seoAlt ?? item.destination?.name ?? 'Sons of Mountains'}
                  title={item.seoTitle ?? item.destination?.name ?? 'Sons of Mountains'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <video
                  src={mediaUrl(item)}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={item.seoAlt ?? 'Видео'}
                  title={item.seoTitle ?? 'Sons of Mountains'}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                {item.destination?.name && (
                  <p className="text-xs text-white/80 tracking-wider truncate">{item.destination.name}</p>
                )}
                {item.trip?.title && (
                  <p className="text-xs text-white/60 truncate">{item.trip.title}</p>
                )}
                {item.caption && (
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{item.caption}</p>
                )}
                <p className={`text-xs mt-1 ${STATUS_COLORS[item.status] ?? 'text-white/40'}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm tracking-widest uppercase text-white/80">Качи медия</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={[
                'border-2 border-dashed rounded-sm py-12 flex flex-col items-center gap-3 cursor-pointer transition-colors',
                dragOver ? 'border-white/40 bg-white/5' : 'border-white/15 hover:border-white/25',
              ].join(' ')}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <>
                  <p className="text-sm text-white/80 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <p className="text-xs tracking-widest text-white/40">ПЛЪЗНИ ИЛИ ИЗБЕРИ ФАЙЛ</p>
                  <p className="text-xs text-white/25">JPG, PNG, WebP, MP4, MOV — макс 200MB</p>
                </>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
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
                <label className="text-xs text-white/40 tracking-widest">ПЪТУВАНЕ</label>
                <select
                  value={form.tripId}
                  onChange={(e) => setForm((f) => ({ ...f, tripId: e.target.value, destinationId: '' }))}
                  className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white appearance-none"
                >
                  <option value="">— Избери —</option>
                  {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <label className="text-xs text-white/40 tracking-widest">ДАТА (НА СНИМКАТА)</label>
              <input
                type="date"
                value={form.takenAt}
                onChange={(e) => setForm((f) => ({ ...f, takenAt: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <label className="text-xs text-white/40 tracking-widest">ПОДПИС (НЕЗАДЪЛЖИТЕЛНО)</label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                rows={2}
                placeholder="Разкажи нещо за тази снимка..."
                className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white resize-none placeholder:text-white/20"
              />
            </div>

            <details className="mt-3">
              <summary className="text-xs text-white/30 cursor-pointer select-none hover:text-white/50 transition-colors">SEO метаданни (по желание)</summary>
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40 tracking-widest">ALT ТЕКСТ</label>
                  <input
                    type="text"
                    value={form.seoAlt}
                    onChange={(e) => setForm((f) => ({ ...f, seoAlt: e.target.value }))}
                    placeholder="Автоматично от дестинация/пътуване"
                    className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white placeholder:text-white/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40 tracking-widest">TITLE</label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                    placeholder="Автоматично от дестинация/пътуване"
                    className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </details>

            {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Качване...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/60 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                disabled={uploading}
                className="flex-1 text-xs tracking-widest border border-white/15 text-white/40 hover:text-white/70 transition-colors py-2.5 rounded-sm disabled:opacity-50"
              >
                ОТКАЗ
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 text-xs tracking-widest bg-white text-black hover:bg-white/90 transition-colors py-2.5 rounded-sm disabled:opacity-40"
              >
                {uploading ? 'КАЧВАНЕ...' : 'КАЧИ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
