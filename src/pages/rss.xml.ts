import config from '@/config'
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

interface Context {
  site: string
}

export async function GET(context: Context) {
  const posts = await getCollection('posts')
  return rss({
    title: config.title,
    description: config.description,
    site: context.site,
    items: posts.map(post => ({
      ...post.data,
      link: `${context.site}posts/${post.id}`,
      pubDate: new Date(post.data.date),
      content: post.body,
    })),
  })
}
