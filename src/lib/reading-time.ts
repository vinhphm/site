export function calculateReadingTime(content: string): { minutes: number, words: number } {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '')

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  // Average reading speed is 200-250 words per minute
  // Using 225 as a middle ground
  const wordsPerMinute = 225
  const minutes = Math.ceil(wordCount / wordsPerMinute)

  return {
    minutes: Math.max(1, minutes), // Minimum 1 minute
    words: wordCount,
  }
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read'
  }
  return `${minutes} min read`
}
