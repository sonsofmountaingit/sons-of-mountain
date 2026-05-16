'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { gsap } from 'gsap'
import { signOut } from '@/lib/auth-client'
import { mediaUrl } from '@/lib/media-url'

interface Props {
  name: string
  email: string
}

const schema = z.object({ name: z.string().min(2, 'Минимум 2 символа') })

export function ProfileClient({ name: initialName, email }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [name, setName] = useState(initialName)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  const [profileImage, setProfileImage] = useState<{ id: string; url: string } | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    fetch('/api/photographer-profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return
        setUsername(d.username ?? '')
        setBio(d.bio ?? '')
        setInstagram(d.instagramHandle ?? '')
        if (d.profileImage?.url) {
          setProfileImage({ id: d.profileImage.id, url: mediaUrl(d.profileImage.url) ?? '' })
        }
      })
  }, [])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('collectionId', '')
    const res = await fetch('/api/dashboard/gallery-upload', { method: 'POST', body: fd })
    const data = await res.json()
    setAvatarUploading(false)
    if (data.id) {
      setProfileImage({ id: data.id, url: mediaUrl(data.url) ?? '' })
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    const parsed = schema.safeParse({ name })
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return }
    setSaving(true)

    // Update Better Auth name
    await fetch('/api/auth/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    // Update Payload photographer fields
    const res = await fetch('/api/photographer-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        instagramHandle: instagram.trim() || undefined,
        profileImageId: profileImage?.id ?? undefined,
      }),
    })

    setSaving(false)
    setMessage(res.ok ? 'Запазено успешно' : 'Грешка при запазване')
  }

  async function logout() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const avatarSrc = profileImage?.url ?? null

  return (
    <div ref={containerRef} className="px-6 lg:px-10 py-10 max-w-lg pb-24 lg:pb-10 opacity-0">
      <h1 className="text-2xl font-light tracking-widest mb-10 uppercase">Профил</h1>

      <form onSubmit={saveProfile} className="flex flex-col gap-5 mb-10">
        {/* Avatar */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Профилна снимка</label>
          <div className="flex items-center gap-4">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/30 text-xl font-bold">
                {name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <label className={[
              'text-xs tracking-widest px-4 py-2.5 border border-white/20 rounded-sm cursor-pointer transition-colors',
              avatarUploading ? 'opacity-40' : 'hover:border-white/50',
            ].join(' ')}>
              {avatarUploading ? 'КАЧВАНЕ…' : 'СМЕНИ СНИМКА'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
            </label>
          </div>
        </div>

        {/* Email — read only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Имейл</label>
          <p className="text-sm text-white/40 px-4 py-3 border border-white/5 rounded-sm">{email}</p>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Пълно име</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Потребителско име (URL)</label>
          <div className="flex items-center">
            <span className="text-white/30 text-sm px-3 py-3 border border-r-0 border-white/10 rounded-l-sm bg-white/5">
              /photographers/
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="vasil-karanikolov"
              className="flex-1 bg-white/5 border border-white/10 rounded-r-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Биография</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Разкажи за себе си — места, стил, визия."
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Instagram */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Instagram</label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@dimitar.karanikolov"
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {message && <p className="text-xs text-white/50">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="py-3 text-xs font-medium tracking-widest border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm disabled:opacity-40"
        >
          {saving ? 'ЗАПАЗВАНЕ…' : 'ЗАПАЗИ ПРОФИЛА'}
        </button>
      </form>

      <div className="border-t border-white/10 pt-8">
        <button
          onClick={logout}
          className="w-full py-3 text-xs font-medium tracking-widest border border-red-900/40 text-red-400/70 hover:text-red-400 hover:border-red-400/40 transition-colors rounded-sm"
        >
          ИЗХОД
        </button>
      </div>
    </div>
  )
}
