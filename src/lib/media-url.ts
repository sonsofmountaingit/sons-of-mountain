/**
 * Converts Payload media URLs to local static paths.
 * Payload stores full URLs (http://localhost:3000/api/media/file/foo.jpg).
 * Next.js Image optimizer rejects localhost as a remote image.
 * Stripping the origin + rewriting /api/media/file/ → /media/ makes them
 * local static paths served directly from public/media/.
 */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  // Strip any origin (http://localhost:3000, https://example.com, etc.)
  const withoutOrigin = url.replace(/^https?:\/\/[^/]+/, '')
  // Rewrite Payload's file route to static path
  return withoutOrigin.replace('/api/media/file/', '/media/')
}
