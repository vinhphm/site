# vinh.dev

## Tech stack

This website is hosted on [Cloudflare](https://cloudflare.com/), built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

## Development

Use Bun 1.4.2, then run `bun install --frozen-lockfile`.
Create an untracked `.env` containing:

```dotenv
PUBLIC_EMAIL=you@example.com
PUBLIC_WORKER_HOST=https://your-worker.example.com
PUBLIC_CIPHER_SHIFT=13
```

These values are public, not secrets. The worker must expose `/og` and `/oembed`.
The cipher shift is optional and defaults to 13; it is obfuscation, not encryption.
Configuration is validated during builds. CI uses placeholder public values.

- `bun run dev`: start the development server.
- `bun run fetch-links`: explicitly refresh missing link-card metadata.
- `bun run fetch-links --force`: refresh existing metadata too.
- Commit `src/data/link-card-metadata.json` with content changes. Builds read this
  snapshot without fetching providers; missing metadata falls back to a domain link.
- `bun run check`, `bun run lint`, `bun run format:check`, `bun run test`: local checks.
- `bun run build`, then `bun run test:e2e`: build and browser smoke tests.
  Install Chromium once with `bunx playwright install chromium`.

TypeScript stays on 6.x until Astro's checker supports TypeScript 7's native compiler.

## Content and browser behavior

RSS intentionally publishes descriptions with links, not raw Markdown/MDX.
Rich embeds load `/oembed/render` on `PUBLIC_WORKER_HOST`, not `srcdoc`. Provider
scripts execute on that separate public origin so nested provider frames retain
their real origins for CORS. Never point this host at the site origin or an
authenticated application. Photo/link responses still use validated DOM rendering.
Resize messages must match both the worker origin and the frame window; heights
are bounded to 120–2000px. The original-post link always remains available.
Deploy the worker's renderer before deploying this site change. Provider restrictions,
authentication requirements, and browser blockers can still prevent rendering.

New browser enhancements should use `onPageLoad` from
`src/utils/browser-lifecycle.ts`, returning cleanup for listeners, observers, and
pending requests. Media previews only enhance explicitly marked, unlinked media.
Use `PreviewImage.astro` instead of Astro's `Image` for previewable MDX images;
plain Markdown images and the site's `Video` component are marked automatically.

## License

1. You are free to use this code as inspiration.
2. Please do not copy it directly.
3. Crediting the author is appreciated.
