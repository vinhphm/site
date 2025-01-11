<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  src: string
  size: 'default' | 'large'
  videoClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
})

const videoSrc = ref<string | undefined>()

function getVideoUrl(videoPath: string): string {
  return new URL(videoPath, import.meta.url).href
}

function getContainerClass() {
  return `flex flex-col items-center justify-center${
    props.size === 'large' ? ' lg:py-10 md:py-5' : ''
  }`
}

function getWrapperClass() {
  return `flex justify-center ${
    props.size === 'large' ? ' lg:scale-120 md:scale-110' : ''
  }`
}

onMounted(() => {
  videoSrc.value = getVideoUrl(props.src)
})
</script>

<template>
  <figure :class="getContainerClass()">
    <div :class="getWrapperClass()">
      <video
        v-if="videoSrc"
        :src="videoSrc"
        :class="videoClass"
        autoplay loop muted playsinline
      />
    </div>
  </figure>
</template>
