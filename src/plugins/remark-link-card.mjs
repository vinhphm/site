import fs from 'node:fs'
import { visit } from 'unist-util-visit'

const metadataPath = new URL('../data/link-card-metadata.json', import.meta.url)
let metadataCache = {}
let metadataMtime = 0

function getMetadata(url) {
  try {
    const mtime = fs.statSync(metadataPath).mtimeMs
    if (mtime !== metadataMtime) {
      metadataCache = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      metadataMtime = mtime
    }
  } catch {
    metadataCache = {}
    metadataMtime = 0
  }
  return metadataCache[url] || null
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}

function linkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>`
}

export default function remarkLinkCard() {
  return (tree) => {
    visit(
      tree,
      ['leafDirective', 'containerDirective', 'textDirective'],
      (node) => {
        if (node.name !== 'link') return

        const rawUrl = node.attributes?.url ?? ''
        const parsedUrl = normalizeUrl(rawUrl)
        if (!parsedUrl) return

        const url = parsedUrl.toString()
        const metadata = getMetadata(url) || {}
        const title = metadata.title?.trim() || ''
        const description = metadata.description?.trim() || ''
        const image = metadata.image?.trim() || ''
        const imageAlt = metadata.imageAlt?.trim() || title
        const domain =
          metadata.siteName?.trim() || parsedUrl.hostname.replace(/^www\./, '')
        const hasImage = Boolean(image)
        const cardClass = hasImage
          ? 'link-card has-image'
          : 'link-card no-image'

        node.type = 'html'
        node.value = `
        <div class="link-card-wrapper">
          <a href="${escapeHtml(url)}" class="${cardClass}" target="_blank" rel="noopener noreferrer">
            <div class="link-card-content">
              <div class="link-card-url">${linkIcon()}<span>${escapeHtml(domain)}</span></div>
              ${title ? `<p class="link-card-title">${escapeHtml(title)}</p>` : ''}
              ${description ? `<p class="link-card-description">${escapeHtml(description)}</p>` : ''}
            </div>
            ${
              hasImage
                ? `
            <div class="link-card-image-outer">
              <div class="link-card-image">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy" />
              </div>
            </div>`
                : ''
            }
          </a>
        </div>`
        delete node.name
        delete node.attributes
        delete node.children
      }
    )
  }
}
