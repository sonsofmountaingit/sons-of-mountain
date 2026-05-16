'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { mediaUrl } from '@/lib/media-url'

interface GalleryImage {
  id?: string
  image: string | { id: string; url?: string | null }
  caption?: string
  featured?: boolean
  takenAt?: string
}

interface Collection {
  id: string
  title: string
  slug: string
  description?: string
  status: 'draft' | 'published'
  coverImage?: { id: string; url?: string | null } | null
  images?: GalleryImage[]
  publishedAt?: string
}

type View = 'list' | 'edit' | 'create'

export function GalleryDashboardClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('list')
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Collection | null>(null)

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    loadCollections()
  }, [])

  async function loadCollections() {
    setLoading(true)
    const res = await fetch('/api/dashboard/gallery-collections')
    const data = await res.json()
    setCollections(data.docs ?? [])
    setLoading(false)
  }

  async function deleteCollection(id: string) {
    if (!confirm('Изтрий тази галерия?')) return
    await fetch('/api/dashboard/gallery-collections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }

  function openEdit(col: Collection) {
    setEditing(col)
    setView('edit')
  }

  function openCreate() {
    setEditing(null)
    setView('create')
  }

  function onSaved(col: Collection) {
    setCollections((prev) => {
      const idx = prev.findIndex((c) => c.id === col.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = col; return next }
      return [col, ...prev]
    })
    setView('list')
  }

  return (
    <div ref={containerRef} className="px-6 lg:px-10 py-10 pb-24 lg:pb-10 opacity-0 max-w-4xl">
      {view === 'list' && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-light tracking-widest uppercase">Галерии</h1>
            <button
              onClick={openCreate}
              className="text-xs tracking-widest px-5 py-2.5 border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm"
            >
              + НОВА ГАЛЕРИЯ
            </button>
          </div>

          {loading && <p className="text-white/30 text-xs tracking-widest">ЗАРЕЖДАНЕ…</p>}

          {!loading && collections.length === 0 && (
            <div className="border border-white/10 rounded-sm p-10 text-center">
              <p className="text-white/30 text-sm mb-4">Нямаш публикувани галерии</p>
              <button onClick={openCreate} className="text-xs tracking-widest text-white/50 hover:text-white transition-colors underline">
                Създай първата
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {collections.map((col) => {
              const cover = mediaUrl(
                typeof col.coverImage === 'object' ? col.coverImage?.url : null
              )
              return (
                <div key={col.id} className="flex items-center gap-4 border border-white/10 rounded-sm p-4 hover:border-white/20 transition-colors">
                  {cover ? (
                    <img src={cover} alt={col.title} className="w-16 h-16 object-cover rounded-sm shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-sm shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{col.title}</p>
                    <p className="text-white/30 text-xs mt-0.5">{col.images?.length ?? 0} снимки · /gallery/{col.slug}</p>
                  </div>
                  <span className={[
                    'text-[10px] tracking-widest px-2 py-1 rounded-sm',
                    col.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-white/5 text-white/30',
                  ].join(' ')}>
                    {col.status === 'published' ? 'ПУБЛИКУВАНА' : 'ЧЕРНОВА'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(col)}
                      className="text-xs tracking-widest px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors rounded-sm"
                    >
                      РЕДАКЦИЯ
                    </button>
                    <Link
                      href={`/gallery/${col.slug}`}
                      target="_blank"
                      className="text-xs tracking-widest px-3 py-1.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors rounded-sm"
                    >
                      ПРЕГЛЕД
                    </Link>
                    <button
                      onClick={() => deleteCollection(col.id)}
                      className="text-xs tracking-widest px-3 py-1.5 border border-red-900/30 text-red-400/50 hover:text-red-400 hover:border-red-400/30 transition-colors rounded-sm"
                    >
                      ИЗТРИЙ
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {(view === 'edit' || view === 'create') && (
        <CollectionEditor
          collection={editing}
          onSaved={onSaved}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  )
}

// ── Collection editor (create / edit) ──────────────────────────────────────

interface EditorProps {
  collection: Collection | null
  onSaved: (col: Collection) => void
  onCancel: () => void
}

function CollectionEditor({ collection, onSaved, onCancel }: EditorProps) {
  const isEdit = !!collection

  const [title, setTitle] = useState(collection?.title ?? '')
  const [slug, setSlug] = useState(collection?.slug ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(collection?.status ?? 'draft')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Cover image
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(
    mediaUrl(typeof collection?.coverImage === 'object' ? collection?.coverImage?.url : null) ?? null
  )
  const [coverMediaId, setCoverMediaId] = useState<string | null>(
    typeof collection?.coverImage === 'object' ? collection?.coverImage?.id ?? null : null
  )

  // Images
  const [images, setImages] = useState<{ mediaId: string; url: string; caption: string; featured: boolean }[]>(
    (collection?.images ?? []).map((img) => ({
      mediaId: typeof img.image === 'object' ? img.image.id : img.image,
      url: mediaUrl(typeof img.image === 'object' ? img.image.url : null) ?? '',
      caption: img.caption ?? '',
      featured: img.featured ?? false,
    }))
  )
  const [uploading, setUploading] = useState(false)

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
  }

  async function uploadCover(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/dashboard/gallery-upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.id) { setCoverMediaId(data.id); setCoverPreview(mediaUrl(data.url) ?? '') }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    await uploadCover(file)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      if (isEdit && collection?.id) fd.append('collectionId', collection.id)
      const res = await fetch('/api/dashboard/gallery-upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.id) {
        setImages((prev) => [...prev, { mediaId: data.id, url: mediaUrl(data.url) ?? '', caption: '', featured: false }])
      }
    }
    setUploading(false)
  }

  function updateCaption(idx: number, caption: string) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, caption } : img))
  }

  function toggleFeatured(idx: number) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, featured: !img.featured } : img))
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setMessage('Заглавието е задължително'); return }
    if (!slug.trim()) { setMessage('Slug-ът е задължителен'); return }
    if (!coverMediaId) { setMessage('Добави корица'); return }

    setSaving(true)
    const body = {
      ...(isEdit ? { id: collection!.id } : {}),
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      coverImageId: coverMediaId,
      status,
      images: images.map((img) => ({ image: img.mediaId, caption: img.caption, featured: img.featured })),
    }

    const res = await fetch('/api/dashboard/gallery-collections', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)

    if (res.ok) {
      const saved = await res.json()
      onSaved(saved)
    } else {
      const err = await res.json()
      setMessage(err.error ?? 'Грешка')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="text-white/30 hover:text-white text-xs tracking-widest transition-colors">
          ← НАЗАД
        </button>
        <h1 className="text-2xl font-light tracking-widest uppercase">
          {isEdit ? 'Редакция на галерия' : 'Нова галерия'}
        </h1>
      </div>

      <form onSubmit={save} className="flex flex-col gap-6">
        {/* Cover image */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest text-white/50 uppercase">Корица *</label>
          <label className="cursor-pointer">
            {coverPreview ? (
              <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-white/5 group">
                <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs tracking-widest">СМЕНИ</span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-sm border border-dashed border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                <span className="text-white/30 text-xs tracking-widest">КАЧИ КОРИЦА</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Заглавие *</label>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)) }}
            placeholder="Тишината на скалите: Норвегия"
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">URL Slug *</label>
          <div className="flex items-center">
            <span className="text-white/30 text-sm px-3 py-3 border border-r-0 border-white/10 rounded-l-sm bg-white/5">/gallery/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(autoSlug(e.target.value))}
              placeholder="norway-rocks"
              className="flex-1 bg-white/5 border border-white/10 rounded-r-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="В Норвегия времето спира…"
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Статус</label>
          <div className="flex gap-3">
            {(['draft', 'published'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={[
                  'text-xs tracking-widest px-5 py-2.5 border rounded-sm transition-colors',
                  status === s
                    ? 'border-white bg-white/10 text-white'
                    : 'border-white/20 text-white/40 hover:border-white/40',
                ].join(' ')}
              >
                {s === 'draft' ? 'ЧЕРНОВА' : 'ПУБЛИКУВАНА'}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest text-white/50 uppercase">Снимки ({images.length})</label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-sm overflow-hidden bg-white/5">
                  <img src={img.url} alt={img.caption} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="self-end text-red-400 text-xs bg-black/50 px-2 py-1 rounded-sm"
                    >
                      ✕
                    </button>
                    <div className="flex flex-col gap-1">
                      <input
                        value={img.caption}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                        placeholder="Надпис…"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black/60 border border-white/20 rounded-sm px-2 py-1 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFeatured(idx)}
                        className={[
                          'text-[10px] tracking-widest px-2 py-1 rounded-sm border transition-colors',
                          img.featured ? 'border-yellow-500/50 text-yellow-400' : 'border-white/20 text-white/40',
                        ].join(' ')}
                      >
                        {img.featured ? '★ ИЗБРАНА' : '☆ ИЗБРАНА'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className={[
            'flex items-center justify-center w-full border border-dashed rounded-sm py-8 cursor-pointer transition-colors',
            uploading ? 'border-white/10 opacity-40' : 'border-white/20 hover:border-white/40',
          ].join(' ')}>
            <span className="text-white/30 text-xs tracking-widest">
              {uploading ? 'КАЧВАНЕ…' : '+ ДОБАВИ СНИМКИ'}
            </span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>

        {message && <p className="text-xs text-red-400/70">{message}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 text-xs font-medium tracking-widest border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm disabled:opacity-40"
          >
            {saving ? 'ЗАПАЗВАНЕ…' : isEdit ? 'ЗАПАЗИ ПРОМЕНИТЕ' : 'СЪЗДАЙ ГАЛЕРИЯ'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-xs tracking-widest border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors rounded-sm"
          >
            ОТКАЗ
          </button>
        </div>
      </form>
    </div>
  )
}
