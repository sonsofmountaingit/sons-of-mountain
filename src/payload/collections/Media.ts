import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import path from 'path'
import fs from 'fs'

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

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [compressVideoOnCreate],
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78, effort: 6, smartSubsample: true } } },
      { name: 'thumbnail_avif', width: 400, height: 300, position: 'centre', formatOptions: { format: 'avif', options: { quality: 60, effort: 7, chromaSubsampling: '4:2:0' } } },
      { name: 'card', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80, effort: 6, smartSubsample: true } } },
      { name: 'card_avif', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'avif', options: { quality: 62, effort: 7, chromaSubsampling: '4:2:0' } } },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82, effort: 6, smartSubsample: true } } },
      { name: 'hero_avif', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'avif', options: { quality: 65, effort: 7, chromaSubsampling: '4:2:0' } } },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: { quality: 80, effort: 6, smartSubsample: true },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
