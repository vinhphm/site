import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import config from '@/constants/config'
import { getDisplayDate, sortWritingsByDate } from '@/lib'

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
      ...writing.data,
      link: `${context.site}writing/${writing.id}`,
      pubDate: getDisplayDate(writing),
      content: writing.body,
    })),
  })
}
