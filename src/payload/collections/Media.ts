import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
import path from 'path'
import fs from 'fs'
import { after } from 'next/server'

const setAltFromFilename: CollectionBeforeChangeHook = ({ data, req }) => {
  if (!data.alt) {
    const file = (req as any).file
    data.alt = file?.name ?? data.filename ?? ''
  }
  return data
}


const compressVideoAfterSave: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const mime: string = doc.mimeType ?? ''
  if (!mime.startsWith('video/')) return doc

  const filename: string = doc.filename ?? ''
  if (!filename) return doc

  // Run async — does not block the upload response
  after(async () => {
    try {
      const staticDir = path.resolve(process.cwd(), 'public/media')
      const filePath = path.join(staticDir, filename)
      if (!fs.existsSync(filePath)) return

      const ffmpegStatic = (await import('ffmpeg-static')).default
      const ffmpeg = (await import('fluent-ffmpeg')).default
      if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic)

      const tmpOut = filePath + '.tmp.mp4'

      await new Promise<void>((resolve, reject) => {
        ffmpeg(filePath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            '-crf 28',
            '-preset fast',
            '-movflags +faststart',
            '-vf scale=\'min(1920,iw):-2\'',
            '-map_metadata -1',
          ])
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .save(tmpOut)
      })

      const compressed = fs.statSync(tmpOut)
      const original = fs.statSync(filePath)

      // Only replace if smaller
      if (compressed.size < original.size) {
        fs.renameSync(tmpOut, filePath)
        await req.payload.update({
          collection: 'media',
          id: doc.id,
          data: { filesize: compressed.size },
        })
      } else {
        fs.unlinkSync(tmpOut)
      }
    } catch {}
  })

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [setAltFromFilename],
    afterChange: [compressVideoAfterSave],
  },
  upload: {
    staticDir: 'public/media',
    staticURL: '/api/media/file',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78, effort: 6, smartSubsample: true } } },
      { name: 'thumbnail_avif', width: 400, height: 300, position: 'centre', formatOptions: { format: 'avif', options: { quality: 60, effort: 7, chromaSubsampling: '4:2:0' } } },
      { name: 'card', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80, effort: 6, smartSubsample: true } } },
      { name: 'card_avif', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'avif', options: { quality: 62, effort: 7, chromaSubsampling: '4:2:0' } } },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82, effort: 6, smartSubsample: true } } },
      { name: 'hero_avif', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'avif', options: { quality: 65, effort: 7, chromaSubsampling: '4:2:0' } } },
    ],
    adminThumbnail: ({ doc }: { doc: Record<string, unknown> }) => {
      const mime = (doc.mimeType as string) ?? ''
      if (mime.startsWith('video/')) return '/icons/video-placeholder.svg'
      const sizes = doc.sizes as Record<string, { url?: string }> | undefined
      const raw = sizes?.thumbnail?.url ?? (doc.url as string) ?? ''
      return raw.replace(/^https?:\/\/[^/]+/, '')
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 80, effort: 6, smartSubsample: true },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
}
