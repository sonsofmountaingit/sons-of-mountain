import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Site Settings' },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Panic Frame' },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Пътувай с Panic Frame там, където комфортът среща приключението.',
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
