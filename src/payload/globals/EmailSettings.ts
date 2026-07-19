import type { GlobalConfig } from 'payload'

export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  admin: { group: 'Email Marketing' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'fromName', type: 'text', defaultValue: 'Sons of Mountains', admin: { description: 'Default sender name for all emails.' } },
    { name: 'fromEmail', type: 'email', admin: { description: 'Default sender address. Must be verified in Resend dashboard.' } },
    { name: 'replyToEmail', type: 'email', admin: { description: 'Global reply-to address. Overridden per-flow by flow.replyTo.' } },
    { name: 'adminEmail', type: 'email', admin: { description: 'Admin BCC address when flow.ccAdmin = true.' } },
    { name: 'logoUrl', type: 'text', admin: { description: 'Absolute URL of logo shown in email header.' } },
    { name: 'brandColor', type: 'text', defaultValue: '#ffffff', admin: { description: 'Primary CTA button color hex.' } },
    { name: 'brandBgColor', type: 'text', defaultValue: '#0a0a0a', admin: { description: 'Email background color.' } },
    { name: 'footerText', type: 'richText', admin: { description: 'Legal footer shown in all campaign emails.' } },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'unsubscribeText', type: 'text', defaultValue: 'Отпиши се', admin: { description: 'Link text for unsubscribe link in campaign email footers.' } },
    { name: 'testMode', type: 'checkbox', defaultValue: false, admin: { description: 'DANGER: When enabled, ALL emails are redirected to testEmail only.' } },
    { name: 'testEmail', type: 'email', admin: { condition: (data) => data.testMode, description: 'All emails go here when testMode is on.' } },
  ],
}
