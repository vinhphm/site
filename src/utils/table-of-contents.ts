export function initTableOfContents() {
  const container = document.querySelector<HTMLElement>('.toc-container')
  const prose = document.querySelector<HTMLElement>('.prose')
  if (!container || !prose) return
  const links = [...container.querySelectorAll<HTMLAnchorElement>('.toc-link')]
  const headings = links.flatMap((link) => {
    const heading = document.getElementById(link.hash.slice(1))
    return heading ? [{ heading, link }] : []
  })
  const titleLink = container.querySelector<HTMLAnchorElement>('.toc-title')
  const controller = new AbortController()
  const offset = 96
  let frame = 0
  let active: HTMLAnchorElement | null = null

  function refresh() {
    frame = 0
    // Measure the actual article instead of duplicating its CSS width in JS.
    const left = prose!.getBoundingClientRect().left
    const visible = headings.length > 0 && left >= 228
    container!.style.display = visible ? 'block' : 'none'
    container!.classList.toggle('fixed-position', visible)
    container!.style.left = visible ? `${left - 216}px` : ''
    let next = titleLink
    for (const entry of headings) {
      if (entry.heading.getBoundingClientRect().top <= offset) next = entry.link
    }
    if (next !== active) {
      active?.classList.remove('active')
      active?.removeAttribute('aria-current')
      next?.classList.add('active')
      next?.setAttribute('aria-current', 'location')
      active = next
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(refresh)
  }
  container.addEventListener(
    'click',
    (event) => {
      if (
        !(event.target instanceof Element) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const link = event.target.closest<HTMLAnchorElement>('.toc-link')
      if (!link) return
      const heading = document.getElementById(link.hash.slice(1))
      if (!heading && link !== titleLink) return
      event.preventDefault()
      const top = heading
        ? heading.getBoundingClientRect().top + window.scrollY - offset
        : 0
      window.scrollTo({
        top,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
      history.pushState(null, '', link.hash || '#')
    },
    { signal: controller.signal }
  )
  window.addEventListener('scroll', schedule, {
    passive: true,
    signal: controller.signal,
  })
  window.addEventListener('resize', schedule, { signal: controller.signal })
  const observer = new ResizeObserver(schedule)
  observer.observe(prose)
  refresh()
  return () => {
    controller.abort()
    observer.disconnect()
    cancelAnimationFrame(frame)
  }
}
