import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

const dirMap: Record<string, string> = {
  writing: 'writings',
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

function formatUtc7(): string {
  const now = new Date()
  const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  return utc7.toISOString().replace('Z', '+07:00')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

async function main() {
  let type: string = process.argv[2] ?? ''
  let title: string = process.argv[3] ?? ''
  let description: string = process.argv[4] ?? ''
  let format: string = process.argv[5] ?? ''

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  if (!type || !(type in dirMap)) {
    const ans = await ask(rl, 'Type (writing): ')
    type = ans.trim() || 'writing'
  }

  const dir = dirMap[type]
  if (!dir) {
    console.error(`Unknown type: ${type}`)
    rl.close()
    process.exit(1)
  }

  if (!title) {
    title = await ask(rl, 'Title: ')
    if (!title.trim()) {
      console.error('Title is required')
      rl.close()
      process.exit(1)
    }
    title = title.trim()
  }

  if (!description) {
    const ans = await ask(rl, 'Description (optional): ')
    description = ans.trim()
  }

  if (!format) {
    const ans = await ask(rl, 'Format — md or mdx? (default: mdx): ')
    const normalized = ans.trim().toLowerCase()
    format = normalized === 'md' ? 'md' : 'mdx'
  }

  rl.close()

  const contentDir = path.join(projectRoot, 'data', dir)
  const slug = slugify(title)
  const ext = format === 'md' ? 'md' : 'mdx'
  const filePath = path.join(contentDir, `${slug}.${ext}`)

  const pubDate = formatUtc7()
  const descLine = description
    ? `description: ${description}`
    : `description: ''`

  const template = `---
title: ${title}
pubDate: ${pubDate}
${descLine}
---

Start writing here...
`

  await fs.promises.mkdir(contentDir, { recursive: true })
  await fs.promises.writeFile(filePath, template)
  console.log(`Created: data/${dir}/${slug}.${ext}`)
}

main()
