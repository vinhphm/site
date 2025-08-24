import type { Config } from '@/types'

const EMAIL = import.meta.env.PUBLIC_EMAIL
const WORKER_HOST = import.meta.env.PUBLIC_WORKER_HOST
const CIPHER_SHIFT = Number(import.meta.env.PUBLIC_CIPHER_SHIFT)

export const config: Config = {
  author: {
    name: 'Vinh Pham',
    email: EMAIL,
    alias: 'vinhphm',
  },
  title: 'Vinh Pham',
  workerHost: WORKER_HOST,
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
        text: 'Writing',
        href: '/writing',
      },
    ],
  },
  footer: {
    navLinks: [
      {
        text: '@vinhdw',
        href: 'https://x.com/vinhdw',
      },
      {
        text: 'github',
        href: 'https://github.com/vinhphm',
      },
      {
        text: 'linkedin',
        href: 'https://www.linkedin.com/in/vinhphm/',
      },
      {
        text: 'email',
        href: '#',
      },
    ],
  },
  cipherShift: CIPHER_SHIFT,
}

export default config
