'use client'

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
})

export const { useSession, signIn, signOut, signUp, resetPassword } = authClient
export const forgotPassword = (data: Parameters<typeof authClient.requestPasswordReset>[0]) =>
  authClient.requestPasswordReset(data)
