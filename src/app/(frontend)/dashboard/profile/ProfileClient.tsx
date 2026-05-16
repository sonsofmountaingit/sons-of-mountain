'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { gsap } from 'gsap'
import { signOut } from '@/lib/auth-client'

interface Props {
  name: string
  email: string
}

const nameSchema = z.object({ name: z.string().min(2, 'Минимум 2 символа') })

export function ProfileClient({ name: initialName, email }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    const parsed = nameSchema.safeParse({ name })
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return }
    setSaving(true)
    // Profile update via Better Auth (update user name)
    const res = await fetch('/api/auth/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setSaving(false)
    setMessage(res.ok ? 'Запазено успешно' : 'Грешка при запазване')
  }

  async function logout() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div ref={containerRef} className="px-6 lg:px-10 py-10 max-w-lg pb-24 lg:pb-10 opacity-0">
      <h1 className="text-2xl font-light tracking-widest mb-10 uppercase">Профил</h1>

      <form onSubmit={saveProfile} className="flex flex-col gap-5 mb-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Имейл</label>
          <p className="text-sm text-white/40 px-4 py-3 border border-white/5 rounded-sm">{email}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest text-white/50 uppercase">Име</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>
        {message && <p className="text-xs text-white/50">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="py-3 text-xs font-medium tracking-widest border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm disabled:opacity-40"
        >
          {saving ? 'ЗАПАЗВАНЕ…' : 'ЗАПАЗИ'}
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
