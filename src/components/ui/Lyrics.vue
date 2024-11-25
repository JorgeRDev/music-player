<script setup lang="ts">
import { Ref, ref, computed, inject, ComputedRef, watch } from "vue"
import ActualSong from "../../lib/actualSong"
import { formatTimeToSeconds } from "../../../lib/time"

const actualSong: Ref<ActualSong> = inject("actualSong", ref(new ActualSong()))

const lyrics: Ref<SongLyric[]> = computed(() => {
  actualSong.value.lyrics?.forEach((lyric) => {
    lyric.timeInSeconds = formatTimeToSeconds(lyric.time)
    console.log(lyric.timeInSeconds)
  })
  return actualSong.value.lyrics ?? []
})

const actualDuration: ComputedRef<number> = computed(
  () => actualSong.value.actualDuration ?? 0,
)

const userChangedDuration: Ref<boolean | undefined> = computed(
  () => actualSong.value.userChangedDuration,
)

const transitionsEnabled: ComputedRef<boolean> = computed(
  () => !userChangedDuration.value,
)

const lyricPlaying: Ref<string> = ref("")
const nextLyricToPlay: Ref<string> = ref("")

const transitionKey: Ref<number> = ref(0)

const previousLyrics = computed(() =>
  lyrics.value.filter((lyric) => lyric.timeInSeconds <= actualDuration.value),
)

const nextLyrics: ComputedRef<SongLyric[]> = computed(() =>
  lyrics.value.filter((lyric) => lyric.timeInSeconds > actualDuration.value),
)

// TODO: This watcher must return the lyrics that are currently playing
watch(actualDuration, (newDuration) => {
  let currentLyricIndex = lyrics.value.findIndex(
    (lyric) => lyric.timeInSeconds > newDuration,
  )

  if (currentLyricIndex === -1) {
    currentLyricIndex = lyrics.value.length
  }

  if (currentLyricIndex > 0) {
    lyricPlaying.value = lyrics.value[currentLyricIndex - 1].lyric
  } else {
    lyricPlaying.value = ""
  }

  if (currentLyricIndex < lyrics.value.length) {
    nextLyricToPlay.value = lyrics.value[currentLyricIndex].lyric
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

const previousLyricsLength = computed(() => previousLyrics.value.length)

watch(previousLyricsLength, () => {
  transitionKey.value++
})
</script>

<template>
  <div
    class="rel place-content:center align-items:center h:100% overflow:hidden"
  >
    <div v-if="transitionsEnabled">
      <Transition name="lyricPlaying" :duration="{ enter: 500, leave: 5000 }">
        <p :key="transitionKey" class="lyricPlaying-element">
          {{ lyricPlaying }}
        </p>
      </Transition>
      <Transition
        v-if="transitionsEnabled"
        name="nextPlaying"
        :duration="{ enter: 200, leave: 500 }"
      >
        <p :key="transitionKey" class="nextPlaying-element">
          {{ nextLyricToPlay }}
        </p>
      </Transition>
    </div>
    <div v-if="!transitionsEnabled">
      <p :key="transitionKey" class="lyricPlaying-element">
        {{ lyricPlaying }}
      </p>
      <p :key="transitionKey" class="nextPlaying-element">
        {{ nextLyricToPlay }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.lyricPlaying-element {
  color: var(--color-text);
  text-align: center;
  font-weight: 500;
  font-size: 20px;
  position: absolute;
  right: 50%;
  top: 35%;
  transform: translate(50%, -50%);
  text-overflow: ellipsis;
  text-wrap: nowrap;
  opacity: 1;
}

.lyricPlaying-enter-active {
  transition: opacity 2s step-end;
}

.lyricPlaying-enter-from {
  opacity: 0;
}
.lyricPlaying-enter-to {
  opacity: 1;
}

.lyricPlaying-leave-active {
  transition:
    top 1s,
    opacity 0.5s,
    font-size 1s;
}

.lyricPlaying-leave-from {
  top: 35%;
  opacity: 1;
}
.lyricPlaying-leave-to {
  top: 10%;
  opacity: 0;
  font-size: 10px;
}

.nextPlaying-element {
  color: var(--color-text);
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  position: absolute;
  right: 50%;
  top: 65%;
  transform: translate(50%, -50%);
  opacity: 0.5;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.nextPlaying-enter-active {
  transition: opacity 0.5s ease-in-out;
}
.nextPlaying-enter-from {
}
.nextPlaying-enter-to {
}

.nextPlaying-leave-active {
  transition:
    font-size 0.5s ease-in-out,
    top 0.5s ease-in-out;
}

.nextPlaying-leave-from {
  top: 65%;
}

.nextPlaying-leave-to {
  top: 35%;
  opacity: 1;
  font-size: 20px;
}
</style>
