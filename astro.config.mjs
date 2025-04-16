import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { transformerCopyButton } from '@rehype-pretty/transformers'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'

import rehypePrettyCode from 'rehype-pretty-code'

export default defineConfig({
  site: 'https://vinh.dev',
  trailingSlash: 'never',

  build: {
    assets: '_assets',
    format: 'file',
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        weights: ['400 600'],
        subsets: ['latin', 'vietnamese'],
        cssVariable: '--font-inter',
      },
      {
        provider: fontProviders.google(),
        name: 'Geist Mono',
        subsets: ['latin'],
        cssVariable: '--font-geist-mono',
        fallbacks: ['monospace'],
      },
    ],
    responsiveImages: true,
    contentIntellisense: true,
  },

  integrations: [
    mdx(),
    sitemap(),
    vue(),
  ],

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'noopener' }],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: 'header-anchor',
            ariaHidden: true,
          },
          content: [
            {
              type: 'text',
              value: '#',
            },
          ],
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light-high-contrast',
            dark: 'github-dark-high-contrast',
          },
          transformers: [
            transformerNotationDiff({
              matchAlgorithm: 'v3',
            }),
            transformerMetaHighlight(),
            transformerCopyButton({
              visibility: 'hover',
              feedbackDuration: 1000,
            }),
          ],
        },
      ],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
