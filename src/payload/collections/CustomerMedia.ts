import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import path from 'path'
import fs from 'fs'

const autoSeo: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data.seoAlt || !data.seoTitle) {
    let name = 'Sons of Mountains'
    if (data.destination) {
      try {
        const dest = await req.payload.findByID({ collection: 'destinations', id: data.destination })
        if (dest?.name) name = dest.name
      } catch {}
    } else if (data.trip) {
      try {
        const trip = await req.payload.findByID({ collection: 'trips', id: data.trip })
        if ((trip as any)?.title) name = (trip as any).title
      } catch {}
    }
    if (!data.seoAlt) data.seoAlt = `${name} — Sons of Mountains`
    if (!data.seoTitle) data.seoTitle = `${name} | Sons of Mountains`
  }
  return data
}

const compressVideoOnCreate: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (operation !== 'create') return data
  if (!data.filePath || !data.mimeType?.startsWith('video/')) return data

  try {
    const ffmpeg = (await import('fluent-ffmpeg')).default
    const ffmpegStatic = (await import('ffmpeg-static')).default
    if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic)

    const inputPath = data.filePath as string
    const ext = path.extname(inputPath)
    const compressed = inputPath.replace(ext, `_c${ext}`)

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-crf 23',
          '-preset fast',
          '-movflags +faststart',
          '-vf scale=\'min(1920,iw):-2\'',
          '-map_metadata -1',
        ])
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .save(compressed)
    })

    fs.renameSync(compressed, inputPath)
  } catch {}

  return data
}

export const CustomerMedia: CollectionConfig = {
  slug: 'customer-media',
  admin: {
    useAsTitle: 'seoTitle',
    group: 'Клиенти',
    defaultColumns: ['customer', 'destination', 'trip', 'mediaType', 'status', 'takenAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'approved' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).collection === 'users') return true
      return { customer: { equals: (req.user as any).id } }
    },
    delete: ({ req }) => (req.user as any)?.collection === 'users',
  },
  hooks: {
    beforeChange: [autoSeo, compressVideoOnCreate],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Снимка', value: 'image' },
        { label: 'Видео', value: 'video' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { position: 'sidebar' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { position: 'sidebar' },
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'takenAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'seoAlt',
      type: 'text',
      admin: { description: 'Auto-filled from destination/trip if empty' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: { description: 'Auto-filled from destination/trip if empty' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Чакащ', value: 'pending' },
        { label: 'Одобрен', value: 'approved' },
        { label: 'Отказан', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
