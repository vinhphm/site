import type { CollectionEntry } from 'astro:content'

export type PostKey = 'posts'

export type CollectionPosts = CollectionEntry<PostKey>

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
  author: string
  title: string
  site: string
  subtitle: string
  description: string
  image: Image
  email: string
  header: Header
  footer: Footer
}
