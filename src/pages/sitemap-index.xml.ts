import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site }) => {
  const mainSitemapUrl = new URL('sitemap-0.xml', site).href
  const postsSitemapUrl = new URL('sitemap-posts.xml', site).href

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${mainSitemapUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${postsSitemapUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
