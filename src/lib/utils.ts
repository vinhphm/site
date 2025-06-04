import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CollectionEntry } from 'astro:content'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Writing utility functions
export function getSortDate(writing: CollectionEntry<'writings'>): number {
  const date = writing.data.updatedAt || writing.data.publishedAt
  return date.valueOf()
}

export function getDisplayDate(writing: CollectionEntry<'writings'>): Date {
  return writing.data.updatedAt || writing.data.publishedAt
}

export function isUpdated(writing: CollectionEntry<'writings'>): boolean {
  return !!writing.data.updatedAt
}

export function sortWritingsByDate(writings: CollectionEntry<'writings'>[]): CollectionEntry<'writings'>[] {
  return writings.sort((a, b) => getSortDate(b) - getSortDate(a))
}

export function getLatestWriting(writings: CollectionEntry<'writings'>[]): CollectionEntry<'writings'> | undefined {
  return sortWritingsByDate(writings)[0]
}

export function createWritingStructuredData(writing: CollectionEntry<'writings'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': writing.data.title,
    'description': writing.data.description,
    'image': writing.data.image,
    'author': {
      '@type': 'Person',
      'name': 'Vinh',
    },
    'datePublished': writing.data.publishedAt.toISOString(),
    ...(isUpdated(writing) && { dateModified: writing.data.updatedAt!.toISOString() }),
  }
}
