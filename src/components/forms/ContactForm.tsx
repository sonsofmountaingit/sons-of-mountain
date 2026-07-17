'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLanguage } from '@/lib/language-context'
import { getDefaultStrings } from '@/lib/get-default-strings'

type Props = {
  namePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
  submitLabel?: string
  submitLoadingLabel?: string
  successHeading?: string
  successSubtext?: string
  successResetLabel?: string
  errorText?: string
  rateLimitedText?: string
  nameMinError?: string
  emailInvalidError?: string
  messageMinError?: string
}

export function ContactForm({
  namePlaceholder: customNamePlaceholder,
  emailPlaceholder: customEmailPlaceholder,
  messagePlaceholder: customMessagePlaceholder,
  submitLabel: customSubmitLabel,
  submitLoadingLabel: customSubmitLoadingLabel,
  successHeading: customSuccessHeading,
  successSubtext: customSuccessSubtext,
  successResetLabel: customSuccessResetLabel,
  errorText: customErrorText,
  rateLimitedText: customRateLimitedText,
  nameMinError: customNameMinError,
  emailInvalidError: customEmailInvalidError,
  messageMinError: customMessageMinError,
}: Props) {
  const { language } = useLanguage()
  const strings = getDefaultStrings(language)
  const cf = strings.contactForm

  const namePlaceholder = customNamePlaceholder ?? cf.namePlaceholder
  const emailPlaceholder = customEmailPlaceholder ?? cf.emailPlaceholder
  const messagePlaceholder = customMessagePlaceholder ?? cf.messagePlaceholder
  const submitLabel = customSubmitLabel ?? cf.submitLabel
  const submitLoadingLabel = customSubmitLoadingLabel ?? cf.submitLoadingLabel
  const successHeading = customSuccessHeading ?? cf.successHeading
  const successSubtext = customSuccessSubtext ?? cf.successSubtext
  const successResetLabel = customSuccessResetLabel ?? cf.successResetLabel
  const errorText = customErrorText ?? cf.errorText
  const rateLimitedText = customRateLimitedText ?? cf.rateLimitedText
  const nameMinError = customNameMinError ?? cf.nameMinError
  const emailInvalidError = customEmailInvalidError ?? cf.emailInvalidError
  const messageMinError = customMessageMinError ?? cf.messageMinError
  const schema = z.object({
    name: z.string().min(2, nameMinError).max(100),
    email: z.string().email(emailInvalidError).max(200),
    message: z.string().min(10, messageMinError).max(5000),
    company: z.string().max(0).optional(),
  })
  type FormData = z.infer<typeof schema>

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate-limited'>('idle')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 429) {
        setStatus('rate-limited')
        return
      }
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-white/10 rounded-lg p-4 sm:p-8 text-center">
        <p className="font-semibold mb-2 text-sm sm:text-base">{successHeading}</p>
        <p className="text-xs sm:text-sm text-white/50">{successSubtext}</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-white/40 hover:text-white underline">
          {successResetLabel}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <input
        {...register('company')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />
      <div>
        <input
          {...register('name')}
          placeholder={namePlaceholder}
          className="w-full bg-white/5 border border-white/10 rounded px-3 sm:px-4 py-3 text-xs sm:text-sm min-h-11 focus:outline-none focus:border-white/30 transition-colors"
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder={emailPlaceholder}
          className="w-full bg-white/5 border border-white/10 rounded px-3 sm:px-4 py-3 text-xs sm:text-sm min-h-11 focus:outline-none focus:border-white/30 transition-colors"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <textarea
          {...register('message')}
          placeholder={messagePlaceholder}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded px-3 sm:px-4 py-3 text-xs sm:text-sm min-h-28 focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 sm:py-3.5 bg-white text-black text-xs sm:text-sm font-semibold rounded min-h-11 hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? submitLoadingLabel : submitLabel}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 text-center">{errorText}</p>
      )}
      {status === 'rate-limited' && (
        <p className="text-xs text-red-400 text-center">{rateLimitedText}</p>
      )}
    </form>
  )
}
