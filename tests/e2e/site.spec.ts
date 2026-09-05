import { test, expect } from '@playwright/test'

test('client navigation and theme survive a round trip', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const article = page.locator('a[href^="/writing/"]').first()
  const href = await article.getAttribute('href')
  await article.click()
  await expect(page).toHaveURL(new RegExp(`${href}$`))
  await expect(page.locator('article')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.goBack()
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).not.toHaveAttribute('data-theme')
})

test('media preview opens by keyboard and restores focus', async ({ page }) => {
  await page.goto('/writing/put-cloudflare-to-work')
  const trigger = page.locator('.media-preview-trigger').first()
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Close media preview' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('TOC links navigate to existing headings', async ({ page }) => {
  await page.goto('/writing/put-cloudflare-to-work')
  const link = page.locator('.toc-link:not(.toc-title)').first()
  const href = await link.getAttribute('href')
  await link.focus()
  await page.keyboard.press('Enter')
  expect(new URL(page.url()).hash).toBe(href)
  await expect(page.locator(`[id="${href?.slice(1)}"]`)).toBeVisible()
})

test('untrusted embed scripts cannot reach the parent document', async ({
  page,
}) => {
  await page.route('https://example.com/oembed?**', (route) =>
    route.fulfill({
      json: {
        type: 'rich',
        html: '<script>parent.document.body.dataset.compromised="yes"</script><p>Embed fixture</p>',
      },
    })
  )
  await page.goto('/writing/one-embed-to-rule-them-all')
  const frame = page.locator('.oembed-content iframe').first()
  await expect(frame).toHaveAttribute('sandbox', 'allow-scripts')
  await expect(frame.contentFrame().locator('p')).toHaveText('Embed fixture')
  await expect(page.locator('body')).not.toHaveAttribute('data-compromised')
  await expect(
    page.getByRole('link', { name: 'View original post' }).first()
  ).toBeVisible()
})

test('RSS contains excerpts, not raw MDX', async ({ request }) => {
  const response = await request.get('/rss.xml')
  expect(response.ok()).toBe(true)
  const xml = await response.text()
  expect(xml).toContain('<item>')
  expect(xml).not.toContain('content:encoded')
  expect(xml).not.toContain('import OEmbed')
})

test('previews reinitialize after client navigation and skip linked images', async ({
  page,
}) => {
  await page.goto('/writing/put-cloudflare-to-work')
  await page.locator('.back-button').click()
  await page.locator('a[href="/writing/put-cloudflare-to-work"]').click()
  const trigger = page.locator('.media-preview-trigger').first()
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close media preview' }).click()
  await expect(trigger).toBeFocused()
  // Fixture a linked preview image, then exercise the same page-load initializer.
  await page.evaluate(() => {
    const anchor = document.createElement('a')
    anchor.href = '#linked-image-destination'
    anchor.id = 'linked-image'
    const image = document.createElement('img')
    image.dataset.preview = 'true'
    image.alt = 'Linked image'
    image.width = 40
    image.height = 40
    image.src =
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>'
    anchor.append(image)
    document.querySelector('.prose')!.prepend(anchor)
    document.dispatchEvent(new Event('astro:page-load'))
  })
  await expect(page.locator('#linked-image button')).toHaveCount(0)
  await page.locator('#linked-image img').click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  expect(new URL(page.url()).hash).toBe('#linked-image-destination')
})

test('media dialog fits a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/writing/put-cloudflare-to-work')
  await page.locator('.media-preview-trigger').first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const bounds = await dialog.boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390)
})

test('embed fallback works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4321/writing/one-embed-to-rule-them-all')
  await expect(
    page.getByRole('link', { name: 'View original post' }).first()
  ).toBeVisible()
  await context.close()
})
