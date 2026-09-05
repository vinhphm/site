import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import config from '@/config'
import { getDisplayDate, sortWritingsByDate } from '@/utils/writing'

type Context = {
  site: string
}

export async function GET(context: Context) {
  const collection = await getCollection('writings')
  const writings = sortWritingsByDate(collection)
  return rss({
    title: config.title,
    description: config.description,
    site: context.site,
    items: writings.map((writing) => ({
      title: writing.data.title,
      description: writing.data.description ?? config.description,
      link: new URL(`/writing/${writing.id}`, context.site).href,
      pubDate: getDisplayDate(writing),
    })),
  })
}
