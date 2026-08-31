'use client'

import { useCallback, useEffect, useState } from 'react'

type CustomerUser = {
  id: string | number
  email: string
  name?: string | null
  collection: 'customers'
  [key: string]: unknown
}

type SessionState = {
  data: { user: CustomerUser } | null
  isPending: boolean
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json()
    const first = body?.errors?.[0]
    return first?.data?.errors?.[0]?.message ?? first?.message ?? body?.message ?? 'Грешка'
  } catch {
    return 'Грешка'
  }
}

let listeners: Array<() => Promise<void>> = []

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ data: null, isPending: true })

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/customers/me', { credentials: 'include', cache: 'no-store' })
      const body = await res.json()
      if (body?.user) {
        setState({ data: { user: body.user }, isPending: false })
      } else {
        setState({ data: null, isPending: false })
      }
    } catch {
      setState({ data: null, isPending: false })
    }
  }, [])

  useEffect(() => {
    refetch()
    listeners.push(refetch)
    return () => {
      listeners = listeners.filter((l) => l !== refetch)
    }
  }, [refetch])

  return state
}

export const signIn = {
  email: async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch('/api/customers/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      return { error: { message: await parseError(res) } }
    }
    const data = await res.json()
    await Promise.all(listeners.map((l) => l()))
    return { data }
  },
}

export const signUp = {
  email: async ({ email, password, name, captchaToken }: { email: string; password: string; name?: string; captchaToken?: string }) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, captchaToken }),
    })
    if (!res.ok) {
      return { error: { message: await parseError(res) } }
    }
    const data = await res.json()
    return { data }
  },
}

export async function signOut() {
  await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
  await Promise.all(listeners.map((l) => l()))
}

export async function forgotPassword({ email }: { email: string; redirectTo?: string }) {
  const res = await fetch('/api/customers/forgot-password', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    return { error: { message: await parseError(res) } }
  }
  return { data: await res.json() }
}

export async function resetPassword({ newPassword, token }: { newPassword: string; token: string }) {
  const res = await fetch('/api/customers/reset-password', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword, token }),
  })
  if (!res.ok) {
    return { error: { message: await parseError(res) } }
  }
  const data = await res.json()
  await Promise.all(listeners.map((l) => l()))
  return { data }
}
