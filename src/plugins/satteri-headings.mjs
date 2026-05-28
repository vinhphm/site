function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^一-龥a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateUniqueSlug(text, usedSlugs) {
  let slug = generateSlug(text)
  let counter = 1
  let uniqueSlug = slug

  while (usedSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  usedSlugs.add(uniqueSlug)
  return uniqueSlug
}

// Factory: resets per-document slug state on each compile.
// Sets CJK-aware IDs and prepends autolink anchors before createHeadingIdsPlugin
// runs. createHeadingIdsPlugin will see the existing id and reuse it for the
// headings metadata, but its textContent() call will pick up the '#' anchor text.
// The page strips the leading '#' when building TOC from metadata.headings.
export function createSatteriHeadingsPlugin() {
  const usedSlugs = new Set()
  let headingIndex = 0

  return {
    name: 'headings',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, ctx) {
        const depth = Number.parseInt(node.tagName[1], 10)

        // Skip the first h1
        if (depth === 1 && headingIndex === 0) {
          headingIndex++
          return
        }

        const text = ctx.textContent(node)
        const slug = generateUniqueSlug(text, usedSlugs)

        ctx.setProperty(node, 'id', slug)

        ctx.prependChild(node, {
          type: 'element',
          tagName: 'a',
          properties: {
            href: `#${slug}`,
            className: ['header-anchor'],
            ariaHidden: 'true',
          },
          children: [{ type: 'text', value: '#' }],
        })

        headingIndex++
      },
    },
  }
}
