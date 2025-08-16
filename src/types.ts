import type { CollectionEntry } from 'astro:content'

export type WritingKey = 'writings'

export type CollectionWritings = CollectionEntry<WritingKey>

export type Author = {
  name: string
  email: string
  alias: string
}

export type NavLink = {
  text: string
  href: string
}

export type OEmbedOptions = {
  maxWidth?: number
  maxHeight?: number
  theme?: 'light' | 'dark'
}

export type Image = {
  src: string
  alt: string
}

export type Header = {
  logo: Image
  navLinks: NavLink[]
}

export type Footer = {
  navLinks: NavLink[]
}

export type Config = {
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
