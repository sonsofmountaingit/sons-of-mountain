export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  // Strip origin so localhost URLs work in Next.js Image and as relative paths
  return url.replace(/^https?:\/\/[^/]+/, '')
}
