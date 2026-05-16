'use client'

import { useRef, useEffect } from 'react'
import { useForm, type FieldValues, type DefaultValues, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'
import { gsap } from 'gsap'

interface Field<T extends FieldValues> {
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodSchema<T>
  defaultValues: DefaultValues<T>
  fields: Field<T>[]
  submitLabel: string
  onSubmit: (values: T) => Promise<{ error?: string }>
  footer?: React.ReactNode
}

export function AuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  submitLabel,
  onSubmit,
  footer,
}: AuthFormProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<T>({ resolver: zodResolver(schema as any), defaultValues })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.auth-field',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.1 },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  async function submit(values: T) {
    gsap.to(btnRef.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 })
    const result = await onSubmit(values)
    if (result.error) {
      setError('root', { message: result.error })
    }
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { scale: 1.01, duration: 0.15, ease: 'power1.out' })
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.15 })
  }

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto opacity-0">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={handleSubmit(submit as any)} className="flex flex-col gap-5">
        {fields.map((f) => (
          <div key={String(f.name)} className="auth-field flex flex-col gap-1.5">
            <label className="text-xs tracking-widest text-white/50 uppercase">{f.label}</label>
            <input
              {...register(f.name)}
              type={f.type ?? 'text'}
              placeholder={f.placeholder}
              onFocus={onFocus}
              onBlur={onBlur}
              className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
            />
            {errors[f.name] && (
              <p className="text-xs text-red-400">{String((errors[f.name] as { message?: string })?.message)}</p>
            )}
          </div>
        ))}

        {errors.root && (
          <p className="text-sm text-red-400 text-center">{errors.root.message}</p>
        )}

        <button
          ref={btnRef}
          type="submit"
          disabled={isSubmitting}
          className="mt-2 py-3 text-xs font-medium tracking-widest border border-white/30 text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm disabled:opacity-40"
        >
          {isSubmitting ? (
            <span className="inline-block w-4 h-4 border border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            submitLabel
          )}
        </button>

        {footer && <div className="text-center">{footer}</div>}
      </form>
    </div>
  )
}
