import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const writings = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './data/writings' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    added: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false).optional(),
    lang: z.string().default('en').optional(),
  }),
})

export const collections = { writings }
