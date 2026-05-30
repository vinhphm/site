import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const writings = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './data/writings' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const collections = { writings }
