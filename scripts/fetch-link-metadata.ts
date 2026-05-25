import fs from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'node-html-parser'

type LinkMetadata = {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  siteName?: string
  updatedAt: string
}

const contentDir = path.resolve('data/writings')
const metadataPath = path.resolve('src/data/link-card-metadata.json')
const force = process.argv.includes('--force')

async function listContentFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return listContentFiles(fullPath)
      if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) return [fullPath]
      return []
    })
  )
  return files.flat()
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

function extractLinkCardUrls(content: string): Set<string> {
  const urls = new Set<string>()
  const pattern = /:{2,3}\s*link\s*\{[^}]*url=(["'])(.*?)\1[^}]*\}/g
  const withoutCodeBlocks = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '')
  for (const match of withoutCodeBlocks.matchAll(pattern)) {
    const url = normalizeUrl(match[2])
    if (url) urls.add(url)
  }
  return urls
}

async function loadMetadata(): Promise<Record<string, LinkMetadata>> {
  try {
    return JSON.parse(await fs.readFile(metadataPath, 'utf-8'))
  } catch {
    return {}
  }
}

function getMeta(root: ReturnType<typeof parse>, selector: string) {
  return root.querySelector(selector)?.getAttribute('content')?.trim() || ''
}

async function fetchMetadata(url: string): Promise<LinkMetadata> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkCard Metadata Fetcher)',
      },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const html = await response.text()
    const root = parse(html)
    const title =
      getMeta(root, 'meta[property="og:title"]') ||
      getMeta(root, 'meta[name="twitter:title"]') ||
      root.querySelector('title')?.text.trim() ||
      ''
    const description =
      getMeta(root, 'meta[property="og:description"]') ||
      getMeta(root, 'meta[name="twitter:description"]') ||
      getMeta(root, 'meta[name="description"]') ||
      ''
    const image =
      getMeta(root, 'meta[property="og:image"]') ||
      getMeta(root, 'meta[name="twitter:image"]') ||
      ''
    const resolvedImage = image ? new URL(image, url).toString() : ''
    return {
      title,
      description,
      image: resolvedImage,
      imageAlt: getMeta(root, 'meta[property="og:image:alt"]') || title,
      siteName:
        getMeta(root, 'meta[property="og:site_name"]') ||
        new URL(url).hostname.replace(/^www\./, ''),
      updatedAt: new Date().toISOString(),
    }
  } finally {
    clearTimeout(timeout)
  }
}

const files = await listContentFiles(contentDir)
const urls = new Set<string>()
for (const file of files) {
  const content = await fs.readFile(file, 'utf-8')
  for (const url of extractLinkCardUrls(content)) urls.add(url)
}

const metadata = await loadMetadata()
let mutated = false

for (const url of Object.keys(metadata)) {
  if (!urls.has(url)) {
    delete metadata[url]
    mutated = true
    console.log(`Pruned ${url}`)
  }
}

const newUrls = [...urls].sort().filter((url) => force || !metadata[url])
const results = await Promise.allSettled(
  newUrls.map((url) => fetchMetadata(url))
)

results.forEach((result, i) => {
  const url = newUrls[i]
  if (result.status === 'fulfilled') {
    metadata[url] = result.value
    mutated = true
    console.log(`Fetched ${url}`)
  } else {
    const reason =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason)
    console.warn(`Skipped ${url}: ${reason}`)
  }
})

if (mutated) {
  const sorted = Object.fromEntries(
    Object.entries(metadata).sort(([a], [b]) => a.localeCompare(b))
  )
  await fs.mkdir(path.dirname(metadataPath), { recursive: true })
  await fs.writeFile(metadataPath, `${JSON.stringify(sorted, null, 2)}\n`)
  console.log('Saved link-card-metadata.json')
}
