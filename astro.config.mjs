import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  site: 'https://vinh.dev',
  trailingSlash: 'never',

  build: {
    assets: '_assets',
    format: 'file',
  },

  compressHTML: true,

  image: {
    responsiveStyles: true,
  },

  experimental: {
    fonts: [
      {
        provider: 'local',
        name: 'Inter',
        cssVariable: '--font-inter',
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/InterVariable.woff2'],
            featureSettings: "'cv05' 1, 'ss07' 1, 'ss08' 1",
          },
          {
            weight: '100 900',
            style: 'italic',
            src: ['./src/assets/fonts/InterVariable-Italic.woff2'],
            featureSettings: "'cv05' 1, 'ss07' 1, 'ss08' 1",
          },
        ],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Geist Mono',
        subsets: ['latin'],
        cssVariable: '--font-geist-mono',
        fallbacks: ['monospace'],
      },
    ],
    contentIntellisense: true,
    liveContentCollections: true,
    svgo: true,
  },

  integrations: [
    expressiveCode({
      themes: ['poimandres', 'snazzy-light'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        `[data-theme='${theme.name === 'poimandres' ? 'dark' : 'light'}']`,
      defaultProps: {
        wrap: true,
        showLineNumbers: false,
        collapseStyle: 'collapsible-auto',
        overridesByLang: {
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
            {
              showLineNumbers: false,
            },
        },
      },
      styleOverrides: {
        borderColor: 'var(--border)',
        borderWidth: '1px',
        borderRadius: '1rem',
        codeFontFamily: 'var(--font-mono)',
        codeBackground:
          'color-mix(in oklab, var(--secondary) 25%, transparent)',
        frames: {
          editorActiveTabForeground: 'var(--muted-foreground)',
          editorActiveTabBackground: 'transparent',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBarBackground:
            'color-mix(in oklab, var(--secondary) 25%, transparent)',
          editorTabBarBorderBottomColor: 'transparent',
          frameBoxShadowCssValue: 'none',
          terminalBackground:
            'color-mix(in oklab, var(--secondary) 25%, transparent)',
          terminalTitlebarBackground: 'transparent',
          terminalTitlebarBorderBottomColor: 'transparent',
          terminalTitlebarForeground: 'var(--muted-foreground)',
        },
        lineNumbers: {
          foreground: 'var(--muted-foreground)',
        },
        uiFontFamily: 'var(--font-sans)',
      },
    }),
    mdx(),
    sitemap(),
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
          manualChunks: {
            'expressive-code': ['astro-expressive-code'],
            icons: ['~icons/ri/circle-fill', '~icons/fluent/new-16-filled'],
          },
        },
      },
    },
  },
})
