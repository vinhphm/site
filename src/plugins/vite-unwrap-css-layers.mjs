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

// TEMPORARY WORKAROUND — remove once iOS Safari fixes cascade-layer support
// or Tailwind stops relying on @layer for its output.
//
// Some iOS Safari betas (confirmed: iOS 27 beta) silently drop @layer
// contents without any console error, leaving the page fully unstyled.
// Tailwind v4 always emits its output inside @layer blocks in correct
// cascade order (properties, theme, base, components, utilities), so
// unwrapping them in place is safe and preserves the same effective rule
// order. Re-test on affected iOS versions periodically and drop this plugin
// once the regression is resolved upstream.
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
