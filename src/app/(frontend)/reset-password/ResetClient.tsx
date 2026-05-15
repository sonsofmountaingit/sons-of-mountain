'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { resetPassword } from '@/lib/auth-client'

const schema = z.object({
  password: z.string().min(8, 'Минимум 8 символа'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Паролите не съвпадат', path: ['confirm'] })

export function ResetClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  async function onSubmit(values: z.infer<typeof schema>) {
    const result = await resetPassword({ newPassword: values.password, token })
    if (result.error) return { error: result.error.message ?? 'Грешка при нулиране' }
    router.push('/login?reset=1')
    return {}
  }

  return (
    <AuthForm
      schema={schema}
      defaultValues={{ password: '', confirm: '' }}
      fields={[
        { name: 'password', label: 'Нова парола', type: 'password', placeholder: '••••••••' },
        { name: 'confirm', label: 'Потвърди паролата', type: 'password', placeholder: '••••••••' },
      ]}
      submitLabel="ЗАДАЙ ПАРОЛА"
      onSubmit={onSubmit}
    />
  )
}
