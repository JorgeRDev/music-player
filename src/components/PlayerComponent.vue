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
  import ActualSong from "../../lib/actualSong"
  import ProgressBar from "./controls/PlaybackPositionSlider.vue"
  import { formatSecondsToTimeString } from "../utils/timeFormatting.ts"
  import pino, { Logger } from "pino"
  import { API as SliderAPI } from "nouislider"
  import PlayPauseButton from "./button/PlayPauseButton.vue"
  import Lyrics from "./ui/Lyrics.vue"
  import { playPauseSong } from "../../lib/musicPlayer"
  import FrontCover from "./ui/FrontCover.vue"

  const logger: Logger<never, boolean> = pino({
    level: "trace",
  })

  const actualSong: Ref<ActualSong | undefined> =
    inject("actualSong", ref(new ActualSong()))

  const actualDuration: ComputedRef<number> =
    inject(
      "actualDuration",
      computed(
        () =>
          actualSong.value?.actualDuration ?? 0
      )
    )

  const tempSliderValue: Ref<number> = inject(
    "tempSliderValue",
    ref(0)
  )

  const totalDuration: ComputedRef<
    number | undefined
  > = inject(
    "totalDuration",
    computed(
      () => actualSong.value?.totalDuration
    )
  )

  const isFullScreen: Ref<boolean | undefined> =
    inject("isFullScreen", ref(undefined))

  const totalDurationFormatted = computed(() =>
    formatSecondsToTimeString(
      totalDuration.value ?? 0
    )
  )

  const tempSliderValueFormatted = computed(() =>
    formatSecondsToTimeString(
      tempSliderValue.value ?? 0
    )
  )

  const isDragging: Ref<boolean> = inject(
    "isDragging",
    ref(false)
  )

  const isDraggingComputed = computed(
    () => isDragging.value
  )

  watch(isDraggingComputed, () => {
    logger.info(
      `isDragging is ${isDraggingComputed.value}`
    )
    if (!isDraggingComputed.value) {
      tempSliderValue.value = actualDuration.value
    }
  })
</script>

<template>
  <div
    v-if="!isFullScreen"
    id="player"
    class="player"
  >
    <div class="player-progress-bar">
      <KeepAlive>
        <ProgressBar />
      </KeepAlive>
    </div>
    <p
      v-if="totalDuration != undefined"
      class="abs f:13 font-color:$(color-text) f:medium z-index:700 top:6 left:10"
    >
      {{ tempSliderValueFormatted }}
    </p>
    <p
      v-if="totalDuration != undefined"
      class="abs f:13 font-color:$(color-text) f:medium z-index:700 top:6 right:10"
    >
      {{ totalDurationFormatted }}
    </p>
    <div class="player-content">
      <div class="song-info-container">
        <FrontCover
          :front-cover-url="
            actualSong?.frontCoverURL
          "
        />
        <div
          class="flex flex:column ml:1.5rem overflow:visible"
        >
          <p
            class="f:medium f:20 font-color:$(color-text) text-overflow:ellipsis lines:1"
          >
            {{ actualSong?.songMetadata?.title }}
          </p>
          <p
            class="f:medium f:16 font-color:$(color-text) text-overflow:ellipsis lines:2"
            v-if="
              actualSong?.songMetadata?.artist !=
              undefined
            "
          >
            {{ actualSong?.songMetadata?.artist }}
            -
            {{ actualSong?.songMetadata?.album }}
          </p>
        </div>
      </div>
      <div class="controls-container">
        <PlayPauseButton />
      </div>
      <Lyrics />
      <div class="settings-container">
        <button>Menu</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .controls-container {
    display: flex;
    flex-flow: row nowrap;
    gap: 0.5rem;
    align-items: center;
    justify-self: center;
  }

  .song-info-container {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    height: 100%;
    overflow: hidden;
  }

  .settings-container {
    display: flex;
    flex-flow: row nowrap;
    gap: 4rem;
    align-items: center;
    justify-self: end;
  }

  .player {
    max-width: 100dvw;
    min-width: 100dvw;
    width: 100dvw;
    min-height: 100%;
    max-height: 100%;
    height: 100%;
    position: sticky;
    z-index: 0;
    background-image: var(
      --player-background-img
    );
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
    top: -8px;
    left: 0;
    width: 100%;
    cursor: pointer;
  }

  .player-progress-bar > * {
    z-index: 300;
  }

  .player-content {
    overflow: hidden;
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr 2fr 1fr;
    position: absolute;
    align-items: center;
    flex-flow: row nowrap;
    padding: 1.6rem 1rem 0.8rem 1rem;
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
