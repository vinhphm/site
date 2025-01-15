import type { Config } from '@/types'

const EMAIL = 'vinh@vinh.dev'

export const config: Config = {
  author: {
    name: 'Vinh Pham',
    email: EMAIL,
    alias: 'vinhphm',
  },
  title: 'Vinh Pham',
  site: 'https://vinh.dev',
  subtitle: 'Thoughts and ideas',
  description: 'Thoughts and ideas',
  image: {
    src: '/hero.jpg',
    alt: 'Vinh Pham',
  },
  header: {
    logo: {
      src: '/logo.svg',
      alt: 'Logo Image',
    },
    navLinks: [
      {
        text: 'home',
        href: '/',
      },
      {
        text: 'posts',
        href: '/posts',
      },
      {
        text: 'email',
        href: `mailto:${EMAIL}`,
      },
    ],
  },
  footer: {
    navLinks: [
      {
        text: '@vinh.dev',
        href: 'https://bsky.app/profile/vinh.dev',
      },
      {
        text: 'github',
        href: 'https://github.com/vinhphm',
      },
      {
        text: 'linkedin',
        href: 'https://www.linkedin.com/in/vinhphm/',
      },
    ],
  },
}

export default config
