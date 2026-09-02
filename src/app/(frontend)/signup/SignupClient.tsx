'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { SignupSecurity, type SignupSecurityHandle } from '@/components/auth/SignupSecurity'
import { signUp } from '@/lib/auth-client'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Невалиден имейл'),
  password: z.string().min(8, 'Минимум 8 символа'),
})

export function SignupClient() {
  const router = useRouter()
  const securityRef = useRef<SignupSecurityHandle>(null)

  async function onSubmit(values: z.infer<typeof schema>, extra: Record<string, unknown>) {
    const result = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      captchaPayload: extra.captchaPayload as string,
      website: extra.website as string,
      formRenderedAt: extra.formRenderedAt as number,
    })
    if (result.error) return { error: result.error.message ?? 'Грешка при регистрация' }
    router.push('/verify-email')
    return {}
  }

  return (
    <AuthForm
      schema={schema}
      defaultValues={{ name: '', email: '', password: '' }}
      fields={[
        { name: 'name', label: 'Име', placeholder: 'Иван Иванов' },
        { name: 'email', label: 'Имейл', type: 'email', placeholder: 'you@example.com' },
        { name: 'password', label: 'Парола', type: 'password', placeholder: '••••••••' },
      ]}
      submitLabel="РЕГИСТРАЦИЯ"
      onSubmit={onSubmit}
      extra={<SignupSecurity ref={securityRef} />}
      getExtraData={() => securityRef.current?.getFields() ?? { captchaPayload: '', website: '', formRenderedAt: Date.now() }}
      footer={
        <span className="text-xs text-white/40">
          Вече имаш акаунт? <Link href="/login" className="text-white/60 hover:text-white transition-colors">Влез</Link>
        </span>
      }
    />
  )
}
