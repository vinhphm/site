import subsetFont from 'subset-font'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fontsDir = path.join(__dirname, '..', 'src', 'assets', 'fonts')

// Standard Google Fonts latin unicode range
const LATIN_RANGES: [number, number][] = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
]

const text = LATIN_RANGES.flatMap(([start, end]) =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    String.fromCodePoint(start + i)
  )
).join('')

const fonts = [
  'InterVariable.woff2',
  'Besley-Italic.woff2',
  'GeistMono.woff2',
  'GeistMono-Italic.woff2',
]

const kb = (n: number) => `${(n / 1024).toFixed(0)}KB`

for (const file of fonts) {
  const filePath = path.join(fontsDir, file)
  const input = await fs.readFile(filePath)
  const output = await subsetFont(input, text, { targetFormat: 'woff2' })

  const before = input.byteLength
  const after = output.byteLength
  const saved = (((before - after) / before) * 100).toFixed(0)

  await fs.writeFile(filePath, output)
  console.log(`${file}: ${kb(before)} → ${kb(after)} (-${saved}%)`)
}
