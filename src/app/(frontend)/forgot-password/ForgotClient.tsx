'use client'

import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { forgetPassword } from '@/lib/auth-client'

const schema = z.object({ email: z.string().email('Невалиден имейл') })

export function ForgotClient() {
  const [sent, setSent] = useState(false)

  async function onSubmit(values: z.infer<typeof schema>) {
    const result = await forgetPassword({
      email: values.email,
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (result.error) return { error: result.error.message ?? 'Грешка' }
    setSent(true)
    return {}
  }

  if (sent) {
    return (
      <p className="text-sm text-white/60 text-center">
        Изпратихме линк за нулиране на паролата. Провери имейла си.
      </p>
    )
  }

  return (
    <AuthForm
      schema={schema}
      defaultValues={{ email: '' }}
      fields={[{ name: 'email', label: 'Имейл', type: 'email', placeholder: 'you@example.com' }]}
      submitLabel="ИЗПРАТИ ЛИНК"
      onSubmit={onSubmit}
      footer={<Link href="/login" className="text-xs text-white/40 hover:text-white/70 transition-colors">← Обратно към вход</Link>}
    />
  )
}
