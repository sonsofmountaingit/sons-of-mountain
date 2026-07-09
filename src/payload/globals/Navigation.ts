import type { GlobalConfig, GlobalBeforeChangeHook } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { revalidateGlobal } from '../hooks/revalidate'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
const revalidateNavigationTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('navigation', 'max') } catch {} }) } catch { /* noop */ }
  return doc
}

type NavLink = { label: string; page?: string | { slug?: string } | null; href?: string }

const resolveHrefs: GlobalBeforeChangeHook = async ({ data, req }) => {
  const resolveLinks = async (links: NavLink[] | undefined): Promise<NavLink[]> => {
    if (!links) return []
    return Promise.all(
      links.map(async (link) => {
        if (!link.page) return link
        const pageId = typeof link.page === 'string' ? link.page : null
        if (!pageId) return link
        try {
          const page = await req.payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
          const slug = (page as { slug?: string }).slug
          return { ...link, href: slug ? `/${slug}` : link.href }
        } catch {
          return link
        }
      }),
    )
  }

  return {
    ...data,
    navLinksLeft: await resolveLinks(data.navLinksLeft as NavLink[]),
    navLinksRight: await resolveLinks(data.navLinksRight as NavLink[]),
  }
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/NavigationVisualEditorButton#NavigationVisualEditorButton',
        },
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo for dark backgrounds' },
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo for light backgrounds' },
    },
    {
      name: 'navLinksLeft',
      type: 'array',
      label: 'Left Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: false,
          admin: { description: 'Pick a page to auto-fill the href, or leave blank and set href manually.' },
        },
        { name: 'href', type: 'text', required: false, admin: { description: 'Auto-filled from page slug. Override here for external links.' } },
      ],
    },
    {
      name: 'navLinksRight',
      type: 'array',
      label: 'Right Navigation Links',
      defaultValue: [{ label: 'Контакти', href: '/contact' }],
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: false,
          admin: { description: 'Pick a page to auto-fill the href, or leave blank and set href manually.' },
        },
        { name: 'href', type: 'text', required: false, admin: { description: 'Auto-filled from page slug. Override here for external links.' } },
      ],
    },
    {
      name: 'instagramUrl',
      type: 'text',
    },
    {
      name: 'facebookUrl',
      type: 'text',
    },
    {
      name: 'tiktokUrl',
      type: 'text',
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeChange: [resolveHrefs],
    afterChange: [revalidateNavigationTag, revalidateGlobal('/')],
  },
}
