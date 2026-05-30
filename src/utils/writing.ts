import type { CollectionEntry } from 'astro:content'

export function getSortDate(writing: CollectionEntry<'writings'>): number {
  return writing.data.pubDate.valueOf()
}

export function getDisplayDate(writing: CollectionEntry<'writings'>): Date {
  return writing.data.pubDate
}

export function sortWritingsByDate(
  writings: CollectionEntry<'writings'>[]
): CollectionEntry<'writings'>[] {
  return writings.sort((a, b) => getSortDate(b) - getSortDate(a))
}

export function getLatestWriting(
  writings: CollectionEntry<'writings'>[]
): CollectionEntry<'writings'> | undefined {
  return sortWritingsByDate(writings)[0]
}

export function createWritingStructuredData(
  writing: CollectionEntry<'writings'>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: writing.data.title,
    description: writing.data.description,
    image: writing.data.image,
    author: {
      '@type': 'Person',
      name: 'Vinh',
    },
    datePublished: writing.data.pubDate.toISOString(),
  }
}
