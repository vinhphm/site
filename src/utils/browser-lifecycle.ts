/** One setup/teardown convention for Astro client navigation. */
export function onPageLoad(setup: () => void | (() => void)) {
  let cleanup: void | (() => void)
  document.addEventListener('astro:before-swap', () => {
    cleanup?.()
    cleanup = undefined
  })
  document.addEventListener('astro:page-load', () => {
    cleanup?.()
    cleanup = setup()
  })
}
