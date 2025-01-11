import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

interface DirMap {
  [key: string]: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

const dirMap: DirMap = {
  post: 'posts',
}

const type = process.argv[2]
const title = process.argv[3]

if (type !== 'post' || !title) {
  console.error('Usage: npm run create post "My New Post Title"')
  process.exit(1)
}

const contentDir = path.join(projectRoot, 'data', dirMap[type])
const slug = title
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]/g, '')
const fileName = `${slug}.mdx`
const filePath = path.join(contentDir, fileName)

const now = new Date()
const utc7Date = new Date(now.getTime() + (7 * 60 * 60 * 1000))
const formattedDate = utc7Date.toISOString().replace('Z', '+07:00')

const template = `---
title: "${title}"
date: "${formattedDate}"
description: "A new post about ${title}"
---

Start writing your content here...
`

await fs.promises.mkdir(contentDir, { recursive: true })
await fs.promises.writeFile(filePath, template)
console.log(`Post created successfully: ${filePath}`)
