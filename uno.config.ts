import { presetWind4 } from '@unocss/preset-wind4'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        :root {
          --font-sans: var(--font-inter);
          --font-mono: var(--font-geist-mono);
        }
      `,
    },
  ],
  shortcuts: [
    {
      'extended-wrapper': 'lg:scale-120 md:scale-110',
      'extended-py': 'md:py-5 lg:py-12',
      'extended-pt': 'md:pt-5 lg:pt-12',
    },
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'text-bottom',
      },
    }),
    presetTypography(),
  ],
  theme: {
    colors: {
      bluesky: 'rgb(10, 122, 255)',
    },
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    'i-devicon-plain-astro',
    'i-logos-chrome',
    'i-ph-file-ts',
    'i-ph-file-vue',
    'i-ri-bluesky-fill',
    'i-simple-icons-cloudflarepages',
    'i-simple-icons-mdnwebdocs',
  ],
})
