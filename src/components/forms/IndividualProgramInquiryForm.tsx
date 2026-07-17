'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

export interface InquiryQuestion {
  label: string
  fieldType: 'text' | 'textarea' | 'number' | 'date' | 'select'
  placeholder?: string
  required?: boolean
  options?: { value: string }[]
}

interface Props {
  questions: InquiryQuestion[]
  namePlaceholder?: string
  emailPlaceholder?: string
  phonePlaceholder?: string
  submitLabel?: string
  submitLoadingLabel?: string
  successHeading?: string
  successSubtext?: string
  errorText?: string
  rateLimitedText?: string
  nameMinError?: string
  emailInvalidError?: string
}

type FormValues = { __name: string; __email: string; __phone: string; __company: string; questions: string[] }

export function IndividualProgramInquiryForm({
  questions,
  namePlaceholder = 'Твоето име',
  emailPlaceholder = 'Имейл адрес',
  phonePlaceholder = 'Телефон',
  submitLabel = 'Send inquiry',
  submitLoadingLabel = 'Изпращане...',
  successHeading = 'Получихме твоето запитване!',
  successSubtext = 'Благодарим ти! Ще се свържем с теб съвсем скоро.',
  errorText = 'Възникна грешка. Моля, опитай отново.',
  rateLimitedText = 'Твърде много опити. Опитай отново по-късно.',
  nameMinError = 'Минимум 2 символа',
  emailInvalidError = 'Невалиден имейл',
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate-limited'>('idle')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>()

  async function onSubmit(values: FormValues) {
    setStatus('loading')
    try {
      const { __name, __email, __phone, __company, questions: questionAnswers } = values
      const answers = questions.map((q, i) => ({ question: q.label, answer: questionAnswers?.[i] ?? '' }))

      const res = await fetch('/api/individual-program-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: __name, email: __email, phone: __phone, company: __company, answers }),
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
      <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 600, marginBottom: 8, color: '#fff' }}>{successHeading}</p>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{successSubtext}</p>
        <button
          onClick={() => setStatus('idle')}
          style={{ marginTop: 16, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Send new
        </button>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#fff', outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        {...register('__company')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <input
            {...register('__name', { required: nameMinError, minLength: { value: 2, message: nameMinError } })}
            placeholder={namePlaceholder}
            style={inputStyle}
          />
          {errors.__name && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 4 }}>{String(errors.__name.message)}</p>}
        </div>
        <div>
          <input
            {...register('__email', { required: emailInvalidError, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: emailInvalidError } })}
            type="email"
            placeholder={emailPlaceholder}
            style={inputStyle}
          />
          {errors.__email && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 4 }}>{String(errors.__email.message)}</p>}
        </div>
        <div>
          <input {...register('__phone')} type="tel" placeholder={phonePlaceholder} style={inputStyle} />
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={i}>
          {q.fieldType === 'textarea' ? (
            <textarea
              {...register(`questions.${i}`, { required: q.required ? 'Задължително поле' : false })}
              placeholder={q.placeholder ?? q.label}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          ) : q.fieldType === 'select' ? (
            <select {...register(`questions.${i}`, { required: q.required ? 'Задължително поле' : false })} style={inputStyle}>
              <option value="">{q.label}</option>
              {(q.options ?? []).map((o, j) => (
                <option key={j} value={o.value}>{o.value}</option>
              ))}
            </select>
          ) : (
            <input
              {...register(`questions.${i}`, { required: q.required ? 'Задължително поле' : false })}
              type={q.fieldType === 'number' ? 'number' : q.fieldType === 'date' ? 'date' : 'text'}
              placeholder={q.placeholder ?? q.label}
              style={inputStyle}
            />
          )}
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{q.label}</label>
          {errors.questions?.[i] && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 2 }}>{String(errors.questions[i]?.message)}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          width: '100%', padding: '0.875rem', background: '#e8501a', color: '#fff', fontSize: '0.875rem',
          fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1,
        }}
      >
        {status === 'loading' ? submitLoadingLabel : submitLabel}
      </button>

      {status === 'error' && <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{errorText}</p>}
      {status === 'rate-limited' && <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{rateLimitedText}</p>}
    </form>
  )
}
