'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { signUp } from '@/lib/auth-client'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Невалиден имейл'),
  password: z.string().min(8, 'Минимум 8 символа'),
})

export function SignupClient() {
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof schema>) {
    const result = await signUp.email({ name: values.name, email: values.email, password: values.password })
    if (result.error) return { error: result.error.message ?? 'Грешка при регистрация' }
    router.push('/dashboard')
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
      footer={
        <span className="text-xs text-white/40">
          Вече имаш акаунт? <Link href="/login" className="text-white/60 hover:text-white transition-colors">Влез</Link>
        </span>
      }
    />
  )
}
