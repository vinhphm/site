export function httpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export type Embed = {
  type: 'photo' | 'link' | 'rich' | 'video'
  url?: string
  title?: string
  html?: string
}

export function parseEmbed(value: unknown): Embed | null {
  if (!value || typeof value !== 'object') return null
  const data = value as Record<string, unknown>
  if (!['photo', 'link', 'rich', 'video'].includes(String(data.type)))
    return null
  if (data.title !== undefined && typeof data.title !== 'string') return null
  if (data.type === 'photo' || data.type === 'link') {
    const url = httpUrl(data.url)
    if (!url) return null
    return {
      type: data.type,
      url,
      title: typeof data.title === 'string' ? data.title : '',
    }
  }
  if (typeof data.html !== 'string') return null
  return { type: data.type as 'rich' | 'video', html: data.html }
}
