'use client'

import { useState } from 'react'
import { z } from 'zod'
import { forgotPassword } from '@/lib/auth-client'

export type CustomerProfile = {
  name: string
  email: string
  phone: string
  preferredLang: 'BG' | 'EN' | 'DE' | 'RU'
  dateOfBirth: string
  address: string
}

const schema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа').max(120),
  phone: z.string().trim().max(40),
  preferredLang: z.enum(['BG', 'EN', 'DE', 'RU']),
  dateOfBirth: z.string().date('Невалидна дата').or(z.literal('')),
  address: z.string().trim().max(300),
})

export function ProfileClient({ initialProfile }: { initialProfile: CustomerProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [resettingPassword, setResettingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  function update<K extends keyof CustomerProfile>(key: K, value: CustomerProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const parsed = schema.safeParse(profile)
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? 'Невалидни данни')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Грешка при запазване')
      setProfile(body.profile)
      setMessage('Промените са запазени успешно.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Грешка при запазване')
    } finally {
      setSaving(false)
    }
  }

  async function requestPasswordReset() {
    setPasswordMessage('')
    setResettingPassword(true)
    const result = await forgotPassword({ email: profile.email })
    setResettingPassword(false)
    setPasswordMessage(result.error
      ? (result.error.message ?? 'Грешка при изпращане на имейла.')
      : 'Изпратихме линк за смяна на паролата. Провери имейла си.')
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-2xl pb-24 lg:pb-10">
      <h1 className="text-2xl font-light tracking-widest mb-10 uppercase">Профил</h1>

      <form onSubmit={saveProfile} className="flex flex-col gap-5">
        <Field label="Имейл">
          <p className="text-sm text-white/40 px-4 py-3 border border-white/5 rounded-sm">{profile.email}</p>
        </Field>
        <Field label="Пълно име">
          <input value={profile.name} onChange={(e) => update('name', e.target.value)} required className={inputClass} />
        </Field>
        <Field label="Телефон">
          <input value={profile.phone} onChange={(e) => update('phone', e.target.value)} type="tel" className={inputClass} />
        </Field>
        <Field label="Дата на раждане">
          <input value={profile.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} type="date" className={inputClass} />
        </Field>
        <Field label="Адрес">
          <textarea value={profile.address} onChange={(e) => update('address', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
        </Field>
        <Field label="Предпочитан език">
          <select value={profile.preferredLang} onChange={(e) => update('preferredLang', e.target.value as CustomerProfile['preferredLang'])} className={inputClass}>
            <option value="BG">Български</option>
            <option value="EN">English</option>
            <option value="DE">Deutsch</option>
            <option value="RU">Русский</option>
          </select>
        </Field>

        {message && <p aria-live="polite" className="text-sm text-white/60">{message}</p>}
        <button type="submit" disabled={saving} className={buttonClass}>
          {saving ? 'ЗАПАЗВАНЕ…' : 'ЗАПАЗИ ПРОМЕНИТЕ'}
        </button>
      </form>

      <section className="border-t border-white/10 mt-10 pt-8">
        <h2 className="text-sm tracking-widest uppercase mb-2">Парола</h2>
        <p className="text-sm text-white/45 mb-5">Ще изпратим защитен линк за задаване на нова парола на {profile.email}.</p>
        {passwordMessage && <p aria-live="polite" className="text-sm text-white/60 mb-4">{passwordMessage}</p>}
        <button type="button" onClick={requestPasswordReset} disabled={resettingPassword} className={buttonClass}>
          {resettingPassword ? 'ИЗПРАЩАНЕ…' : 'ИЗПРАТИ ЛИНК ЗА НОВА ПАРОЛА'}
        </button>
      </section>
    </div>
  )
}

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors'
const buttonClass = 'py-3 px-5 text-xs font-medium tracking-widest border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm disabled:opacity-40'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5 text-xs tracking-widest text-white/50 uppercase">{label}{children}</label>
}
