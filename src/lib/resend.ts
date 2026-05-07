import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'
export const FROM_NAME = 'Panic Frame'
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`
