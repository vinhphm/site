import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import Icons from 'unplugin-icons/vite'
import remarkContentFeatures from './src/plugins/remark-content-features.mjs'
import remarkReadingTime from './src/plugins/remark-reading-time.mjs'
import remarkTOC from './src/plugins/remark-toc.mjs'

export default defineConfig({
  site: 'https://vinh.dev',
  trailingSlash: 'never',

  build: {
    assets: '_assets',
    format: 'file',
  },

  compressHTML: true,

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      subsets: ['latin', 'vietnamese'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/InterVariable.woff2'],
            featureSettings: "'ss07' 1, 'ss08' 1",
          },
          {
            weight: '100 900',
            style: 'italic',
            src: ['./src/assets/fonts/InterVariable-Italic.woff2'],
            featureSettings: "'ss07' 1, 'ss08' 1",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      subsets: ['latin', 'vietnamese'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/GeistMono.woff2'],
          },
          {
            weight: '100 900',
            style: 'italic',
            src: ['./src/assets/fonts/GeistMono-Italic.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Besley',
      cssVariable: '--font-besley',
      subsets: ['latin'],
      options: {
        variants: [
          {
            weight: '400',
            style: 'italic',
            src: ['./src/assets/fonts/Besley-Italic.woff2'],
          },
        ],
      },
    },
  ],

  image: {
    responsiveStyles: true,
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
    remarkPlugins: [remarkContentFeatures, remarkReadingTime, remarkTOC],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'noopener' }],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          properties: { className: 'header-anchor', ariaHidden: true },
          content: [{ type: 'text', value: '#' }],
        },
      ],
      rehypeCleanup,
      rehypeImageProcessor,
      rehypeCopyCode,
    ],
  },

  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
        scale: 1.2,
        defaultStyle: 'display: inline-block; vertical-align: text-bottom;',
      }),
    ],
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('~icons/')) return 'icons'
          },
        },
      },
    },
  },
})
