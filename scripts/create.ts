import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type DirMap = {
  [key: string]: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

const dirMap: DirMap = {
  writing: 'writings',
}

const type = process.argv[2]
const title = process.argv[3]

if (type !== 'writing' || !title) {
  process.exit(1)
}

const contentDir = path.join(projectRoot, 'data', dirMap[type] ?? 'writings')
const slug = title
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]/g, '')
const fileName = `${slug}.mdx`
const filePath = path.join(contentDir, fileName)

const UTC7_OFFSET_HOURS = 7
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_HOUR =
  SECONDS_PER_MINUTE * MINUTES_PER_HOUR * MILLISECONDS_PER_SECOND

const now = new Date()
const utc7Time = new Date(
  now.getTime() + UTC7_OFFSET_HOURS * MILLISECONDS_PER_HOUR
)
const formattedTime = utc7Time.toISOString().replace('Z', '+07:00')

const template = `---
title: ${title}
added: ${formattedTime}
description: A new writing about ${title}
---

Start writing your content here...
`

await fs.promises.mkdir(contentDir, { recursive: true })
await fs.promises.writeFile(filePath, template)
