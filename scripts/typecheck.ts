// Syncs Astro types (.astro/ is gitignored, absent on fresh checkouts), then runs tsc
// with the content mapper, ignoring diagnostics from node_modules (Astro's own .astro
// components fail under our strict options).
const sync = Bun.spawnSync(['bunx', 'astro', 'sync'], {
  stdout: 'inherit',
  stderr: 'inherit',
})
if (sync.exitCode !== 0) process.exit(sync.exitCode ?? 1)

const proc = Bun.spawn(
  ['bunx', 'tsc', '--noEmit', '--runExternalCode', '--pretty', 'false'],
  {
    stdout: 'pipe',
    stderr: 'pipe',
  }
)
const [stdout, stderr] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
])
await proc.exited

// A diagnostic starts at column 0; indented lines continue the previous one.
const blocks: string[] = []
for (const line of stdout.split('\n')) {
  if (/^\s/.test(line) && blocks.length)
    blocks[blocks.length - 1] += '\n' + line
  else if (line.trim()) blocks.push(line)
}

const own = blocks.filter((b) => !b.startsWith('node_modules/'))
const ignored = blocks.length - own.length

if (stderr.trim()) console.error(stderr.trim())
if (own.length) console.error(own.join('\n'))
console.log(
  `typecheck: ${own.length} error(s)` +
    (ignored ? ` (${ignored} in node_modules ignored)` : '')
)
process.exit(own.length || (stderr.trim() && !blocks.length) ? 1 : 0)

export {}
