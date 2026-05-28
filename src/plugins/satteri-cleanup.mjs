// Factory: per-document state for figure extraction index tracking
export function createSatteriCleanupPlugin() {
  return {
    name: 'cleanup',
    element: [
      // Task list item: strip leading space after checkbox
      {
        filter: ['li'],
        visit(node, ctx) {
          if (!node.properties?.className?.includes('task-list-item')) return

          const children = node.children ?? []
          let inputIndex = -1

          for (let i = 0; i < children.length; i++) {
            const child = children[i]
            if (
              child.type === 'element' &&
              child.tagName === 'input' &&
              child.properties?.type === 'checkbox'
            ) {
              inputIndex = i
              break
            }
          }

          if (inputIndex === -1) return

          for (let i = inputIndex + 1; i < children.length; i++) {
            const child = children[i]
            if (child.type === 'comment') continue
            if (child.type === 'text' && child.value.startsWith(' ')) {
              ctx.setProperty(child, 'value', child.value.replace(/^\s+/, ''))
            }
            break
          }
        },
      },
      // Figure extraction: lift <figure> raw nodes out of <p> wrappers
      // This is handled implicitly by Sätteri — raw HTML injected via {rawHtml:}
      // returns are not wrapped in <p> by the parser, so no cleanup needed here.
      // However we still handle the case where raw figures may land inside <p>.
      {
        filter: ['p'],
        visit(node, ctx) {
          const children = node.children ?? []
          const rawFigures = []
          let allOk = true

          for (const child of children) {
            if (
              child.type === 'raw' &&
              child.value?.trim().startsWith('<figure')
            ) {
              rawFigures.push(child)
            } else if (child.type !== 'text' || child.value.trim() !== '') {
              allOk = false
              break
            }
          }

          if (!allOk || rawFigures.length === 0) return

          // Replace <p> with its raw figure children by inserting before and removing
          for (let i = rawFigures.length - 1; i >= 0; i--) {
            ctx.insertBefore(node, rawFigures[i])
          }
          ctx.removeNode(node)
        },
      },
    ],
  }
}
