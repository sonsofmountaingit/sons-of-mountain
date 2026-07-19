import type { SerializedEditorState } from 'lexical'
import type { JSONContent } from '@maily-to/render'

export type EmailTemplateDoc = {
  contentType: 'maily' | 'richtext' | 'html'
  subject: string
  mailyContent?: JSONContent | null
  content?: SerializedEditorState | null
  htmlContent?: string | null
}

export type EmailSettingsDoc = {
  fromName?: string | null
  fromEmail?: string | null
  replyToEmail?: string | null
  adminEmail?: string | null
  logoUrl?: string | null
  brandColor?: string | null
  brandBgColor?: string | null
  footerText?: SerializedEditorState | null
  socialLinks?: { platform?: string | null; url?: string | null }[] | null
  unsubscribeText?: string | null
  testMode?: boolean | null
  testEmail?: string | null
}

export function substituteMergeTags(str: string, context: Record<string, unknown>): string {
  return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => {
    const value = context[key]
    return value == null ? '' : String(value)
  })
}

async function renderLexical(data: SerializedEditorState): Promise<string> {
  const { convertLexicalToHTMLAsync, defaultHTMLConvertersAsync } = await import('@payloadcms/richtext-lexical/html-async')
  return convertLexicalToHTMLAsync({ data, converters: defaultHTMLConvertersAsync })
}

async function renderBody(template: EmailTemplateDoc, context: Record<string, unknown>): Promise<string> {
  if (template.contentType === 'maily' && template.mailyContent) {
    const { Maily } = await import('@maily-to/render')
    const maily = new Maily(template.mailyContent)
    const stringContext: Record<string, string> = {}
    for (const [key, value] of Object.entries(context)) stringContext[key] = value == null ? '' : String(value)
    maily.setVariableValues(stringContext)
    maily.setShouldReplaceVariableValues(true)
    return maily.render()
  }
  if (template.contentType === 'html' && template.htmlContent) {
    return substituteMergeTags(template.htmlContent, context)
  }
  if (template.content) {
    const html = await renderLexical(template.content)
    return substituteMergeTags(html, context)
  }
  return ''
}

function renderSocialLinks(settings: EmailSettingsDoc): string {
  const links = (settings.socialLinks ?? []).filter((l): l is { platform: string; url: string } => !!l.url && !!l.platform)
  if (!links.length) return ''
  return `<div style="margin-top:16px">${links
    .map((l) => `<a href="${l.url}" style="color:#555;font-size:11px;margin:0 8px;text-decoration:none">${l.platform}</a>`)
    .join('')}</div>`
}

export async function renderEmail(
  template: EmailTemplateDoc,
  context: Record<string, unknown>,
  settings: EmailSettingsDoc,
  isMarketing = false,
): Promise<{ html: string; unsubscribeUrl?: string }> {
  const body = await renderBody(template, context)
  const logoUrl = settings.logoUrl ?? ''
  const bg = settings.brandBgColor ?? '#0a0a0a'
  const footerHtml = settings.footerText ? await renderLexical(settings.footerText) : ''
  const unsubscribeUrl = context.unsubscribe_url ? String(context.unsubscribe_url) : undefined

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px">
    ${logoUrl ? `<div style="text-align:center;margin-bottom:48px"><img src="${logoUrl}" height="32" alt="Sons of Mountains" /></div>` : ''}
    ${body}
    <div style="border-top:1px solid #1a1a1a;padding-top:24px;margin-top:48px;text-align:center">
      ${footerHtml}
      ${isMarketing && unsubscribeUrl ? `<p><a href="${unsubscribeUrl}" style="color:#555;font-size:11px">${settings.unsubscribeText ?? 'Unsubscribe'}</a></p>` : ''}
      ${renderSocialLinks(settings)}
    </div>
  </div>
</body>
</html>`

  return { html, unsubscribeUrl: isMarketing ? unsubscribeUrl : undefined }
}
