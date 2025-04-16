<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { nextTick } from 'vue'

const isDark = useDark({ storageKey: 'color-scheme' })

function toggleDark(event: MouseEvent) {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }
  // Add the theme-transition class to the root element to avoid conflicts
  document.documentElement.classList.add('theme-transition')
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value
          ? clipPath.reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  }).finally(() => {
    // Remove the class precisely after the transition
    transition.finished.then(() => {
      document.documentElement.classList.remove('theme-transition')
    })
  })
}
</script>

<template>
  <button
    aria-label="Toggle theme"
    class="icon-[ri--circle-fill] text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 cursor-pointer"
    @click="toggleDark"
  >
    <span class="sr-only">Toggle theme</span>
  </button>
</template>
