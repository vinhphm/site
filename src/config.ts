import type { Config } from '@/types'
import { readEnvironment } from '@/utils/environment'

const {
  email: EMAIL,
  workerHost: WORKER_HOST,
  cipherShift: CIPHER_SHIFT,
} = readEnvironment(import.meta.env)

export const config: Config = {
  author: {
    name: 'Vinh Pham',
    email: EMAIL,
    alias: 'vinhphm',
  },
  title: 'VINH',
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
  },
  footer: {
    navLinks: [
      {
        text: '@vinhev',
        href: 'https://x.com/vinhev',
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
