<script setup lang="ts">
  import {
    Ref,
    ref,
    computed,
    inject,
    ComputedRef,
    watch,
  } from "vue"
  import ActualSong from "../../../lib/actualSong"
  import { formatTimeToSeconds } from "../../../lib/time"
  import pino, { Logger } from "pino"

  const logger: Logger<never, boolean> = pino({
    level: "silent",
  })
  const actualSong: Ref<ActualSong> = inject(
    "actualSong",
    ref(new ActualSong())
  )

  const { isFullScreen = false } = defineProps<{
    isFullScreen?: Boolean
  }>()

  const nextPlayingName = computed(() =>
    !isFullScreen
      ? "next-playing"
      : "next-playing-fullscreen"
  )

  const lyricPlayingName = computed(() =>
    !isFullScreen
      ? "lyric-playing"
      : "lyric-playing-fullscreen"
  )
  const lyrics: Ref<SongLyric[]> = computed(
    () => {
      actualSong.value.lyrics?.forEach(
        (lyric) => {
          lyric.timeInSeconds =
            formatTimeToSeconds(lyric.time)
          logger.trace(lyric.timeInSeconds)
        }
      )
      return actualSong.value.lyrics ?? []
    }
  )

  const actualDuration: ComputedRef<number> =
    computed(
      () => actualSong.value.actualDuration ?? 0
    )

  const userChangedDuration: Ref<
    boolean | undefined
  > = computed(
    () => actualSong.value.userChangedDuration
  )

  const transitionsEnabled: ComputedRef<boolean> =
    computed(() => !userChangedDuration.value)

  const lyricPlaying: Ref<string> = ref("")
  const nextLyricToPlay: Ref<string> = ref("")

  const transitionKey: Ref<number> = ref(0)

  const previousLyrics = computed(() =>
    lyrics.value.filter(
      (lyric) =>
        lyric.timeInSeconds <=
        actualDuration.value
    )
  )

  const nextLyrics: ComputedRef<SongLyric[]> =
    computed(() =>
      lyrics.value.filter(
        (lyric) =>
          lyric.timeInSeconds >
          actualDuration.value
      )
    )

  // TODO: This watcher must return the lyrics that are currently playing
  watch(actualDuration, (newDuration) => {
    let currentLyricIndex =
      lyrics.value.findIndex(
        (lyric) =>
          lyric.timeInSeconds > newDuration
      )

    if (currentLyricIndex === -1) {
      currentLyricIndex = lyrics.value.length
    }

    if (currentLyricIndex > 0) {
      lyricPlaying.value =
        lyrics.value[currentLyricIndex - 1].lyric
    } else {
      lyricPlaying.value = ""
    }

    if (currentLyricIndex < lyrics.value.length) {
      nextLyricToPlay.value =
        lyrics.value[currentLyricIndex].lyric
    } else {
      nextLyricToPlay.value = ""
    }
    // Filter the lyrics array to only include lyrics that are less than or equal to the current duration

    // TODO: In the end, this should return the index in the array of lyrics[] that is currently playing
    /* if (previousLyrics.value.length === 0) {
    lyricPlaying.value = ""
  } else {
    lyricPlaying.value =
      previousLyrics.value[previousLyrics.value.length - 1].lyric ??
      "There is no lyric"
  }

  if (nextLyrics.value.length === 0) {
    nextLyricToPlay.value = ""
  } else {
    nextLyricToPlay.value = nextLyrics.value[0].lyric
  } */
  })

  const previousLyricsLength = computed(
    () => previousLyrics.value.length
  )

  watch(previousLyricsLength, () => {
    transitionKey.value++
  })
</script>

<template>
  <div
    class="rel place-content:center align-items:center h:100% overflow:hidden"
  >
    <div v-if="transitionsEnabled">
      <Transition
        :name="lyricPlayingName"
        :duration="{ enter: 500, leave: 500 }"
      >
        <p
          :key="transitionKey"
          class="lyric-playing-element"
          :class="{ fullscreen: isFullScreen }"
        >
          {{ lyricPlaying }}
        </p>
      </Transition>
      <Transition
        v-if="transitionsEnabled"
        :name="nextPlayingName"
        :duration="{ enter: 100, leave: 300 }"
      >
        <p
          :key="transitionKey"
          class="next-playing-element"
          :class="{ fullscreen: isFullScreen }"
        >
          {{ nextLyricToPlay }}
        </p>
      </Transition>
    </div>
    <div v-if="!transitionsEnabled">
      <p
        :key="transitionKey"
        class="lyric-playing-element"
        :class="{ fullscreen: isFullScreen }"
      >
        {{ lyricPlaying }}
      </p>
      <p
        :key="transitionKey"
        class="next-playing-element"
        :class="{ fullscreen: isFullScreen }"
      >
        {{ nextLyricToPlay }}
      </p>
    </div>
  </div>
</template>

<style scoped>
  .lyric-playing-element {
    color: var(--color-text);
    text-align: center;
    font-weight: 500;
    font-size: 1.25rem;
    position: absolute;
    right: 50%;
    top: 35%;
    transform: translate(50%, -50%);
    text-overflow: ellipsis;
    text-wrap: nowrap;
    opacity: 1;
  }

  .lyric-playing-element.fullscreen {
    font-size: 1.625rem;
    top: 15%;
    color: white;
  }

  .lyric-playing-enter-active {
    transition: opacity 0.3s step-end;
  }

  .lyric-playing-enter-from {
    opacity: 0;
  }
  .lyric-playing-enter-to {
    opacity: 1;
  }

  .lyric-playing-fullscreen-enter-active {
    transition: opacity 0.3s step-end;
  }

  .lyric-playing-fullscreen-enter-from {
    opacity: 0;
  }
  .lyric-playing-fullscreen-enter-to {
    opacity: 1;
  }

  .lyric-playing-leave-active {
    transition:
      top 1s,
      opacity 0.5s,
      font-size 0.5s;
  }

  .lyric-playing-leave-from {
    top: 35%;
    opacity: 1;
  }
  .lyric-playing-leave-to {
    top: 0%;
    opacity: 0;
    font-size: 10px;
  }

  .lyric-playing-fullscreen-leave-active {
    transition:
      top 300ms,
      opacity 300ms,
      font-size 300ms;
  }

  .lyric-playing-fullscreen-leave-from {
    top: 35%;
    opacity: 1;
  }
  .lyric-playing-fullscreen-leave-to {
    top: 0%;
    opacity: 0;
    font-size: 10px;
  }

  .next-playing-element {
    color: var(--color-text);
    text-align: center;
    font-weight: 500;
    position: absolute;
    right: 50%;
    top: 65%;
    transform: translate(50%, -50%);
    opacity: 0.5;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    font-size: 1rem;
  }
  .next-playing-element.fullscreen {
    font-size: 1.25rem;
    top: 35%;
    color: white;
  }

  .next-playing-enter-active {
    transition: opacity 0.5s ease-in-out;
  }

  .next-playing-leave-active {
    transition:
      font-size 0.3s linear,
      top 0.3s linear,
      opacity 300ms step-end;
  }

  .next-playing-leave-from {
    top: 65%;
  }

  .next-playing-leave-to {
    top: 35%;
    opacity: 0;
    font-size: 1.25rem;
  }

  .next-playing-fullscreen-enter-active {
    transition: opacity 0.5s ease-in-out;
  }

  .next-playing-fullscreen-leave-active {
    transition:
      top 300ms linear,
      opacity 300ms step-end,
      font-size 300ms linear;
  }

  .next-playing-fullscreen-leave-from {
    font-size: 1.25rem;
    top: 35%;
  }

  .next-playing-fullscreen-leave-to {
    top: 15% !important;
    opacity: 0;
    font-size: 1.625rem !important;
  }
</style>
