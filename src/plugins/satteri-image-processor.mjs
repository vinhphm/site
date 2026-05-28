// Factory: resets hasPriorityImage per document
export function createSatteriImageProcessorPlugin() {
  let hasPriorityImage = false

  return {
    name: 'image-processor',
    element: [
      // Step 1: enhance img attributes
      {
        filter: ['img'],
        visit(node, ctx) {
          const shouldPrioritize = !hasPriorityImage
          hasPriorityImage = true

          const existing = node.properties?.className ?? []
          const classes = Array.isArray(existing)
            ? existing
            : (existing.split?.(' ').filter(Boolean) ?? [])
          if (!classes.includes('img-placeholder')) {
            classes.push('img-placeholder')
          }

          ctx.setProperty(node, 'data-preview', 'true')
          ctx.setProperty(node, 'loading', 'lazy')
          ctx.setProperty(node, 'decoding', 'async')
          ctx.setProperty(node, 'className', classes)
          if (shouldPrioritize) {
            ctx.setProperty(node, 'fetchpriority', 'high')
          }
        },
      },
      // Step 2: wrap standalone images in figure/figcaption
      {
        filter: ['p'],
        visit(node, ctx) {
          const children = node.children ?? []
          const imgNodes = []
          let hasNonImageContent = false

          for (const child of children) {
            if (child.type === 'element' && child.tagName === 'img') {
              imgNodes.push(child)
            } else if (child.type !== 'text' || child.value.trim() !== '') {
              hasNonImageContent = true
            }
          }

          if (hasNonImageContent || imgNodes.length === 0) return

          const newNodes = imgNodes.map((imgNode) => {
            const alt = imgNode.properties?.alt?.trim?.()
            if (!alt || alt.includes('_')) return imgNode

            return {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['image-caption-wrapper'] },
              children: [
                imgNode,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: { className: ['img-caption'] },
                  children: [{ type: 'text', value: alt }],
                },
              ],
            }
          })

          // Replace <p> with figure nodes
          for (let i = newNodes.length - 1; i >= 0; i--) {
            ctx.insertBefore(node, newNodes[i])
          }
          ctx.removeNode(node)
        },
      },
    ],
  }
}
