<script setup lang="ts">
import PlayIcon from "../icons/PlayIcon.vue"
import { inject, Ref, ref, computed } from "vue"
import ActualSong from "../../lib/actualSong"
import PauseIcon from "../icons/PauseIcon.vue"

const playPauseSong = inject("playPauseSong", () => {})

const actualSong: Ref<ActualSong> = inject("actualSong", ref(new ActualSong()))

const isPlaying = computed(() => actualSong.value.song?.playing())
</script>

<template>
  <button
    class="rel aspect:1/1 h:4rem bg:rgba(216,216,216,0.26) shadow:0|0|20|rgba(0,0,0,0.1) backdrop-filter:saturate(1.8) bg:$(color-ui-background-hover):hover cursor:pointer round"
    @click="playPauseSong"
  >
    <div class="abs top:51% left:53% transform:translate(-50%,-50%)">
      <div class="aspect:1/1 h:25px">
        <PlayIcon v-if="!isPlaying" />
        <PauseIcon v-else />
      </div>
    </div>
  </button>
</template>
