import { satteri } from '@astrojs/markdown-satteri'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import { satteriExternalLinks } from './src/plugins/satteri-external-links.mjs'
import { createSatteriHeadingsPlugin } from './src/plugins/satteri-headings.mjs'
import { satteriLinkCard } from './src/plugins/satteri-link-card.mjs'
import { createSatteriCleanupPlugin } from './src/plugins/satteri-cleanup.mjs'
import { createSatteriImageProcessorPlugin } from './src/plugins/satteri-image-processor.mjs'
import { unwrapCssLayers } from './src/plugins/vite-unwrap-css-layers.mjs'
import Icons from 'unplugin-icons/vite'

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
      subsets: ['latin'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/InterVariable.woff2'],
            featureSettings: "'ss07' 1, 'ss08' 1",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      subsets: ['latin'],
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
            weight: '100 900',
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
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [satteriLinkCard],
      hastPlugins: [
        satteriExternalLinks,
        createSatteriHeadingsPlugin,
        createSatteriCleanupPlugin,
        createSatteriImageProcessorPlugin,
      ],
    }),
  },

  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
        scale: 1.2,
        defaultStyle: 'display: inline-block; vertical-align: text-bottom;',
      }),
      unwrapCssLayers(),
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
