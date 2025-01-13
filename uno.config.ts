import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'nav-link': 'opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer',
      'extended-wrapper': 'lg:scale-120 md:scale-110',
      'extended-py': 'md:py-5 lg:py-12',
      'hr-line': 'w-14 mx-auto border-solid border-1px',
    },
  ],
  presets: [
    presetUno(),
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
    presetWebFonts({
      fonts: {
        sans: 'Inter:100..900',
        mono: 'Geist Mono:400..700',
      },
      processors: [
        createLocalFontProcessor(),
      ],
    }),
  ],
  theme: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      additive: {
        DEFAULT: 'hsl(var(--additive))',
        foreground: 'hsl(var(--additive-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      border: 'hsl(var(--border))',
      ring: 'hsl(var(--ring))',
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
