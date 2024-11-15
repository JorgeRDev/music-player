<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  Ref,
  ref,
  watch,
  watchEffect,
} from "vue"
import ActualSong from "../lib/actualSong"
import ProgressBar from "./musicplayer/ProgressBar.vue"
import { formatTime } from "../lib/time"
import pino, { Logger } from "pino"
import { SliderAPI } from "vue-slider-component"

const logger: Logger<never, boolean> = pino({ level: "trace" })

const actualSong: Ref<ActualSong | undefined> = inject(
  "actualSong",
  ref(new ActualSong()),
)

const actualDuration: ComputedRef<number> = inject(
  "actualDuration",
  computed(() => actualSong.value?.actualDuration ?? 0),
)

const tempSliderValue: Ref<number> = inject("tempSliderValue", ref(0))

const totalDuration: ComputedRef<number | undefined> = inject(
  "totalDuration",
  computed(() => actualSong.value?.totalDuration),
)

const isFullScreen: Ref<boolean | undefined> = inject(
  "isFullScreen",
  ref(undefined),
)

const totalDurationFormatted = computed(() =>
  formatTime(totalDuration.value ?? 0),
)

const tempSliderValueFormatted = computed(() =>
  formatTime(tempSliderValue.value ?? 0),
)

const isDragging: Ref<boolean> = inject("isDragging", ref(false))

const isDraggingComputed = computed(() => isDragging.value)

watch(isDraggingComputed, () => {
  logger.info(`isDragging is ${isDraggingComputed.value}`)
  if (!isDraggingComputed.value) {
    tempSliderValue.value = actualDuration.value
  }
})
</script>

<template>
  <div v-if="!isFullScreen" id="player" class="player">
    <div class="player-progress-bar">
      <KeepAlive>
        <ProgressBar />
      </KeepAlive>
    </div>
    <p
      class="abs f:13 font-color:$(color-text) f:medium z-index:700 top:6 left:10"
    >
      {{ tempSliderValueFormatted }}
    </p>
    <p
      class="abs f:13 font-color:$(color-text) f:medium z-index:700 top:6 right:10"
    >
      {{ totalDurationFormatted }}
    </p>
    <div class="player-content">
      <div class="front-cover aspect:1/1 h:90%">
        <img
          :src="actualSong?.getFrontCoverURL()"
          alt="Song Front Cover"
          class="aspect:1/1 h:100% r:1rem"
        />
      </div>
      <div class="flex flex:column place-content:space-between ml:1rem">
        <p
          class="f:medium f:20 font-color:$(color-text) text-shadow:3rem|0|3rem|rgba(255,255,255,0.993)"
        >
          {{ actualSong?.songMetadata?.title }}
        </p>
        <p
          class="f:medium f:16 font-color:$(color-text) text-shadow:4rem|0|3rem|rgba(255,255,255,0.849)"
        >
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
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  position: sticky;
  z-index: 0;
  background-image: var(--player-background-img);
  background-size: cover;
  background-position-y: center;
}

.player::before {
  content: "";
  position: absolute;
  z-index: -100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Color de fondo del seudoelemento */
  mix-blend-mode: multiply; /* Modo de mezcla para crear el efecto de transparencia */
  backdrop-filter: blur(30px);
}

.player-progress-bar {
  position: absolute;
  z-index: 300;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 100%;
}

.player-progress-bar > * {
  z-index: 300;
}

.player-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  flex-flow: row nowrap;
  padding: 0.8rem;
  padding-top: 1.6rem;
}

.player-content > * {
  z-index: 200;
}

.player-content::before {
  z-index: 100;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  opacity: 0.856;
} /* @media (min-width: 500px) {
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
