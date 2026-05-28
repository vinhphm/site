export const satteriExternalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href
      if (typeof href !== 'string') return
      if (!href.startsWith('http://') && !href.startsWith('https://')) return
      ctx.setProperty(node, 'target', '_blank')
      ctx.setProperty(node, 'rel', 'noopener')
    },
  },
}
