'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Altcha } from './Altcha'

export interface SignupSecurityHandle {
  getFields: () => { captchaPayload: string; website: string; formRenderedAt: number }
}

export const SignupSecurity = forwardRef<SignupSecurityHandle>(function SignupSecurity(_props, ref) {
  const renderedAt = useRef(Date.now())
  const websiteRef = useRef<HTMLInputElement>(null)
  const [captchaPayload, setCaptchaPayload] = useState('')

  useImperativeHandle(ref, () => ({
    getFields: () => ({
      captchaPayload,
      website: websiteRef.current?.value ?? '',
      formRenderedAt: renderedAt.current,
    }),
  }), [captchaPayload])

  return (
    <>
      <input
        ref={websiteRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
      />
      <Altcha onToken={setCaptchaPayload} />
    </>
  )
})
