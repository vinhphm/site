import rss from '@astrojs/rss'
import config from '@config'
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
      pubDate: new Date(post.data.updatedDate || post.data.createdDate),
      content: post.body,
    })),
  })
}
