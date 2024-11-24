<script setup lang="ts">
import { Ref, ref, computed, inject, ComputedRef, watch } from "vue"
import ActualSong from "../../lib/actualSong"

const actualSong: Ref<ActualSong> = inject("actualSong", ref(new ActualSong()))
const lyrics: Ref<Lyrics[]> = ref("")

const actualDuration: ComputedRef<number> = computed(
  () => actualSong.value.actualDuration ?? 0,
)

const lyricPlaying: Ref<string> = ref("")

// TODO: This watcher must return the lyrics that are currently playing
watch(actualDuration, () => {
  // Filter the lyrics array to only include lyrics that are less than or equal to the current duration
  lyrics.value.filter((lyric) => lyric.time <= actualDuration.value)
  // TODO: In the end, this should return the index in the array of lyrics[] that is currently playing
  lyricPlaying.value = lyrics.value[0].text
})
</script>

<template>
  <div class="flex flex:column nowrap place-content:center align-items:center">
    <!--     <div class="f:medium f:28">Y te encontré</div>
    <div class="f:medium f:24 opacity:0.5">Suspirando en un bar de Bógota</div> -->
  </div>
</template>
