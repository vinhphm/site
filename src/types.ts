import type { CollectionEntry } from 'astro:content'

export type WritingKey = 'writings'

export type CollectionWritings = CollectionEntry<WritingKey>

export interface Author {
  name: string
  email: string
  alias: string
}

export interface NavLink {
  text: string
  href: string
}

export interface OEmbedOptions {
  maxWidth?: number
  maxHeight?: number
  theme?: 'light' | 'dark'
}

export interface Image {
  src: string
  alt: string
}

export interface Header {
  logo: Image
  navLinks: NavLink[]
}

export interface Footer {
  navLinks: NavLink[]
}

export interface Config {
  author: Author
  title: string
  site?: string
  workerHost: string
  subtitle: string
  description: string
  image: Image
  header: Header
  footer: Footer
}
