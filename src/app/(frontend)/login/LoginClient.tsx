'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { signIn } from '@/lib/auth-client'

const schema = z.object({
  email: z.string().email('Невалиден имейл'),
  password: z.string().min(6, 'Минимум 6 символа'),
})

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  async function onSubmit(values: z.infer<typeof schema>) {
    const result = await signIn.email({ email: values.email, password: values.password })
    if (result.error) return { error: result.error.message ?? 'Грешен имейл или парола' }
    router.push(redirect)
    return {}
  }

  return (
    <AuthForm
      schema={schema}
      defaultValues={{ email: '', password: '' }}
      fields={[
        { name: 'email', label: 'Имейл', type: 'email', placeholder: 'you@example.com' },
        { name: 'password', label: 'Парола', type: 'password', placeholder: '••••••••' },
      ]}
      submitLabel="ВХОД"
      onSubmit={onSubmit}
      footer={
        <div className="flex flex-col gap-2 text-xs text-white/40">
          <Link href="/forgot-password" className="hover:text-white/70 transition-colors">Забравена парола?</Link>
          <span>Нямаш акаунт? <Link href="/signup" className="text-white/60 hover:text-white transition-colors">Регистрирай се</Link></span>
        </div>
      }
    />
  )
}
