'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { z } from 'zod'
import { AuthForm } from './AuthForm'
import { signIn, signUp } from '@/lib/auth-client'

interface Props {
  onSuccess: (user: { id: string; name: string; email: string }) => void
  onClose: () => void
}

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

export function AuthModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [])

  function close() {
    gsap.to(panelRef.current, { opacity: 0, y: 12, duration: 0.2, ease: 'power2.in', onComplete: onClose })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 })
  }

  async function onLogin(values: z.infer<typeof loginSchema>) {
    const result = await signIn.email({ email: values.email, password: values.password })
    if (result.error) return { error: result.error.message ?? 'Invalid email or password' }
    const user = (result.data as any)?.user
    if (user) onSuccess({ id: user.id, name: user.name ?? '', email: user.email })
    return {}
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    const result = await signUp.email({ name: values.name, email: values.email, password: values.password })
    if (result.error) return { error: result.error.message ?? 'Registration failed' }
    const user = (result.data as any)?.user
    if (user) onSuccess({ id: user.id, name: user.name ?? values.name, email: user.email ?? values.email })
    return {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div ref={backdropRef} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />
      <div ref={panelRef} className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-sm p-8 shadow-2xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-xs tracking-widest"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-2">Sons of Mountains</p>
          <h2 className="text-xl font-light tracking-wide text-white">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account'}
          </h2>
          <p className="mt-2 text-xs text-white/40">Your voucher will be saved to your account</p>
        </div>

        <div className="flex border border-white/10 rounded-sm mb-8 overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${mode === 'login' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${mode === 'signup' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <AuthForm
            key="login"
            schema={loginSchema}
            defaultValues={{ email: '', password: '' }}
            fields={[
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ]}
            submitLabel="SIGN IN"
            onSubmit={onLogin}
          />
        ) : (
          <AuthForm
            key="signup"
            schema={signupSchema}
            defaultValues={{ name: '', email: '', password: '' }}
            fields={[
              { name: 'name', label: 'Full name', placeholder: 'John Smith' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ]}
            submitLabel="CREATE ACCOUNT"
            onSubmit={onSignup}
          />
        )}
      </div>
    </div>
  )
}
