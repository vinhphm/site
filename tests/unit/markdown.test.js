import { expect, test } from 'bun:test'
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri'
import { parse } from 'node-html-parser'
import { createSatteriHeadingsPlugin } from '../../src/plugins/satteri-headings.mjs'
import { createSatteriImageProcessorPlugin } from '../../src/plugins/satteri-image-processor.mjs'
import { satteriLinkCard } from '../../src/plugins/satteri-link-card.mjs'

const processor = await createSatteriMarkdownProcessor({
  syntaxHighlight: false,
  features: { directive: true },
  hastPlugins: [createSatteriHeadingsPlugin, createSatteriImageProcessorPlugin],
  mdastPlugins: [satteriLinkCard],
})

test('heading IDs are unique, nonempty, and reset between documents', async () => {
  const markdown = '## Hello\n\n## Hello\n\n## 日本語\n\n## 🎉\n\n## 🎉'
  const first = await processor.render(markdown)
  const second = await processor.render(markdown)
  expect(second.code).toBe(first.code)
  const ids = parse(first.code)
    .querySelectorAll('h2')
    .map((node) => node.id)
  expect(ids).toEqual(['hello', 'hello-1', '日本語', 'section', 'section-1'])
  expect(first.metadata.headings.map((heading) => heading.slug)).toEqual(ids)
})

test('image wrapping preserves order and priority resets per document', async () => {
  const markdown =
    '![First](https://example.com/1.png)\n![Second](https://example.com/2.png)'
  const first = await processor.render(markdown)
  expect((await processor.render(markdown)).code).toBe(first.code)
  const root = parse(first.code)
  expect(root.querySelectorAll('figcaption').map((node) => node.text)).toEqual([
    'First',
    'Second',
  ])
  expect(root.querySelector('p figure')).toBeNull()
  const images = root.querySelectorAll('img')
  expect(images[0].getAttribute('loading')).toBe('eager')
  expect(images[1].getAttribute('loading')).toBe('lazy')
  expect(images.every((image) => image.hasAttribute('data-preview'))).toBe(true)
})

test('link directives fall back safely without metadata', async () => {
  const result = await processor.render(
    '::link{url="https://example.com/test"}'
  )
  const link = parse(result.code).querySelector('.link-card')
  expect(link.getAttribute('href')).toBe('https://example.com/test')
  expect(link.text).toContain('example.com')
  const invalid = await processor.render('::link{url="javascript:alert(1)"}')
  expect(parse(invalid.code).querySelector('.link-card')).toBeNull()
})
