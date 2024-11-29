<script setup lang="ts">
  import MusicIcon from "../icons/MusicIcon.vue"

  interface Props {
    frontCoverUrl?: string | undefined
  }

  const { frontCoverUrl = undefined } =
    defineProps<Props>()
</script>

<template>
  <div
    class="flex place-content:center align-items:center aspect:1/1 h:98% r:20% overflow:clip bg:rgba(255,255,255,0.1)"
  >
    <img
      v-if="frontCoverUrl !== undefined"
      :src="frontCoverUrl"
      alt=""
    />
    <div v-else class="h:40%">
      <MusicIcon color="#70707054" />
    </div>
  </div>
</template>
