import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig, fontProviders } from 'astro/config'
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

  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Inter',
        weights: ['100 900'],
        subsets: ['latin', 'vietnamese'],
        cssVariable: '--font-inter',
      },
      {
        provider: fontProviders.fontsource(),
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
    expressiveCode({
      themes: ['poimandres', 'snazzy-light'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: theme => `[data-theme='${theme.name === 'poimandres' ? 'dark' : 'light'}']`,
      defaultProps: {
        wrap: true,
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
        codeFontFamily: 'var(--font-mono)',
        codeBackground:
          'color-mix(in oklab, var(--secondary) 25%, transparent)',
        frames: {
          editorActiveTabForeground: 'var(--muted-foreground)',
          editorActiveTabBackground:
            'transparent',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBarBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
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
        defaultClass: 'inline-block align-text-bottom',
      }),
    ],
  },
})
