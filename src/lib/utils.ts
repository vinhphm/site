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

export function getSortDate(writing: CollectionEntry<'writings'>): number {
  const date = writing.data.updated || writing.data.added
  return date.valueOf()
}

export function getDisplayDate(writing: CollectionEntry<'writings'>): Date {
  return writing.data.updated || writing.data.added
}

export function isUpdated(writing: CollectionEntry<'writings'>): boolean {
  return !!writing.data.updated
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
    'datePublished': writing.data.added.toISOString(),
    ...(isUpdated(writing) && { dateModified: writing.data.updated!.toISOString() }),
  }
}
