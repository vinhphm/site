function unwrapLayers(css) {
  let out = ''
  let i = 0
  const opener = /@layer\s+[a-zA-Z-]+\s*\{/y

  while (i < css.length) {
    opener.lastIndex = i
    const match = opener.exec(css)

    if (match && match.index === i) {
      let depth = 1
      let j = i + match[0].length
      while (depth > 0 && j < css.length) {
        if (css[j] === '{') depth++
        else if (css[j] === '}') depth--
        j++
      }
      out += css.slice(i + match[0].length, j - 1)
      i = j
      continue
    }

    if (css.startsWith('@layer', i)) {
      const end = css.indexOf(';', i)
      if (end !== -1) {
        i = end + 1
        continue
      }
    }

    out += css[i]
    i++
  }

  return out
}

// Some iOS Safari betas silently drop @layer contents without any console
// error, leaving the page fully unstyled. Tailwind v4 always emits its
// output inside @layer blocks in correct cascade order (properties, theme,
// base, components, utilities), so unwrapping them in place is safe and
// preserves the same effective rule order.
export function unwrapCssLayers() {
  return {
    name: 'unwrap-css-layers',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          file.source = unwrapLayers(file.source.toString())
        }
      }
    },
  }
}
