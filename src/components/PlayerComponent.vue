<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref, watchEffect } from "vue"
import ActualSong from "../lib/actualSong"
import { base64ToUint8Array } from "uint8array-extras"

const actualSong: Ref<ActualSong | undefined> = inject(
  "actualSong",
  ref(new ActualSong()),
)

const actualDuration: Ref<number> = computed(
  () => actualSong.value?.actualDuration ?? 0,
)

const isFullScreen: Ref<boolean | undefined> = inject(
  "isFullScreen",
  ref(undefined),
)

const actualDurationComputed = computed(() =>
  actualSong.value?.getActualDuration(),
)

function formatTime(seconds: number): string {
  if (!seconds) return "00:00:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}

const songDurationFormatted = computed(() =>
  formatTime(actualSong.value?.getMetadata()?.duration ?? 0),
)

const tempSliderValueFormatted = computed(() =>
  formatTime(tempSliderValue.value ?? 0),
)

const isDragging = ref(false)
const tempSliderValue = ref(0)

watchEffect(() => {
  if (!isDragging.value) {
    tempSliderValue.value = actualDuration.value
  }
})
</script>

<template>
  <div v-if="!isFullScreen" id="player" class="player">
    <div class="player-content">
      <p>{{ tempSliderValueFormatted }}</p>
      <input
        class="ml:3rem"
        type="range"
        min="0"
        :max="actualSong?.getMetadata()?.duration"
        v-model="tempSliderValue"
        @mousedown="isDragging = true"
        @change="
          (event) => {
            actualSong?.setActualDuration(Number(event.target.value))
            isDragging = false
          }
        "
      />
      <p>{{ isDragging }}</p>
      <p>{{ songDurationFormatted }}</p>
      <div class="pl:2rem pr:1rem">
        <img
          :src="actualSong?.getFrontCoverURL()"
          alt="Song Front Cover"
          class="aspect:1/1 w:5rem r:1rem"
        />
      </div>
      <div class="flex flex:column place-content:space-between">
        <p class="f:medium f:20">{{ actualSong?.songMetadata?.title }}</p>
        <p class="f:medium f:16 f:gray">
          {{ actualSong?.songMetadata?.artist }} -
          {{ actualSong?.songMetadata?.album }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.player {
  max-width: 100dvw;
  min-width: 100dvw;
  width: 100dvw;
  position: relative;
  background-image: var(--player-background-img);
  background-size: cover;
  background-position-y: center;
}

.player::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.6
  ); /* Color de fondo del seudoelemento */
  mix-blend-mode: multiply; /* Modo de mezcla para crear el efecto de transparencia */
  backdrop-filter: blur(20px);
}

.player-content {
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  place-content: center;
  flex-flow: row nowrap;
}

/* @media (min-width: 500px) {
  .player {
    background: green;
  }
}
@media (min-width: 800px) {
  .player {
    background: blue;
  }
}
@media (min-width: 1280px) {
  .player {
    background: red;
  }
}
@media (min-width: 1920px) {
  .player {
    background: brown;
  }
}
@media (min-width: 2560px) {
  .player {
    background: yellow;
  }
} */
</style>
