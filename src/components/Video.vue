<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  src: string
  extended?: boolean
  videoClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  extended: false,
})

const videoSrc = ref<string | undefined>()

function getVideoUrl(videoPath: string): string {
  return new URL(videoPath, import.meta.url).href
}

function getContainerClass() {
  return `flex flex-col items-center justify-center${
    props.extended ? ' extended-py' : ''
  }`
}

function getWrapperClass() {
  return `flex justify-center ${
    props.extended ? ' extended-wrapper' : ''
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
