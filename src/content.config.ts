import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const writings = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './data/writings' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false).optional(),
    lang: z.string().default('en').optional(),
  }),
})

export const collections = { writings }
