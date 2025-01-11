<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  url: string
  maxWidth?: number
}>()

const isDark = useDark()
const oembedData = ref<any>(null)
const containerRef = ref<HTMLElement>()

async function fetchOembedData() {
  try {
    const response = await fetch(
      `https://worker.vinh.dev/oembed?url=${encodeURIComponent(props.url)}&theme=${isDark.value ? 'dark' : 'light'}`,
    )
    oembedData.value = await response.json()
    if (oembedData.value?.type === 'rich') {
      nextTick(() => injectContent(oembedData.value.html))
    }
  } catch (error) {
    console.error('Failed to fetch oembed data:', error)
  }
}

function injectContent(html: string) {
  if (!containerRef.value)
    return
  containerRef.value.innerHTML = ''
  const temp = document.createElement('div')
  temp.innerHTML = html
  const scripts = Array.from(temp.getElementsByTagName('script'))
  scripts.forEach((oldScript) => {
    oldScript.parentNode?.removeChild(oldScript)
  })
  containerRef.value.innerHTML = temp.innerHTML
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script')
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value)
    })
    newScript.innerHTML = oldScript.innerHTML
    containerRef.value?.appendChild(newScript)
  })
}

onMounted(() => {
  fetchOembedData()
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }
})

watch(isDark, () => {
  fetchOembedData()
})
</script>

<template>
  <div v-if="oembedData" class="oembed-container">
    <div
      v-if="oembedData.type === 'rich'"
      ref="containerRef"
      :style="`max-width: ${maxWidth || 800}px;`"
    />

    <img
      v-else-if="oembedData.type === 'photo'"
      :src="oembedData.url"
      :alt="oembedData.title || ''"
      :width="oembedData.width"
      :height="oembedData.height"
      :style="`max-width: ${maxWidth || 800}px;`"
    >

    <div
      v-else-if="oembedData.type === 'video'"
      class="video-container"
      :style="`max-width: ${maxWidth || 800}px;`"
      v-html="oembedData.html"
    />

    <a
      v-else-if="oembedData.type === 'link'"
      :href="oembedData.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ oembedData.title || url }}
    </a>
  </div>
</template>

<style scoped>
.oembed-container {
  margin: 1rem 0;
  width: 100%;
}
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}
.video-container :deep(iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
