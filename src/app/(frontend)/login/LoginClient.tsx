'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { signIn } from '@/lib/auth-client'
import { useLanguage } from '@/lib/language-context'
import { getDefaultStrings } from '@/lib/get-default-strings'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const { language } = useLanguage()
  const strings = getDefaultStrings(language)

  async function onSubmit(values: z.infer<typeof schema>) {
    const result = await signIn.email({ email: values.email, password: values.password })
    if (result.error) return { error: result.error.message ?? strings.auth.loginError }
    router.push(redirect)
    return {}
  }

  return (
    <AuthForm
      schema={schema}
      defaultValues={{ email: '', password: '' }}
      fields={[
        { name: 'email', label: strings.auth.email, type: 'email', placeholder: 'you@example.com' },
        { name: 'password', label: strings.auth.password, type: 'password', placeholder: '••••••••' },
      ]}
      submitLabel={strings.auth.login.toUpperCase()}
      onSubmit={onSubmit}
      footer={
        <div className="flex flex-col gap-2 text-xs text-white/40">
          <Link href="/forgot-password" className="hover:text-white/70 transition-colors">{strings.auth.forgotPassword}</Link>
          <span>{strings.auth.noAccount} <Link href="/signup" className="text-white/60 hover:text-white transition-colors">{strings.auth.signup}</Link></span>
        </div>
      }
    />
  )
}
