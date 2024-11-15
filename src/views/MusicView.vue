<script setup lang="ts">
import { inject, ref, Ref } from "vue"
import { SongInfo } from "../lib/songInfo"
import type { MusicLibrary } from "../lib/musicLibrary"
import { watch } from "vue"
import pino, { Logger } from "pino"
import { formatTime } from "../lib/time"

const logger: Logger<never, boolean> = pino({ level: "silent" })

const musicLibrary: MusicLibrary = inject("musicLibrary")

const actualSong: Ref<string> = inject("actualSong", ref("There is no song"))

const loadAndPlaySong = inject(
  "loadAndPlaySong",
  async (songPath: string) => {},
)

const songsLibrary: Ref<Map<string, SongInfo>> = inject(
  "songsLibrary",
  ref(new Map()),
)

watch(musicLibrary.getSongsInfo(), (newVal) => {
  logger.info(`musicLibrary.getSongsInfo() has changed to ${newVal}`)
})
</script>

<template>
  <h1 class="f:48 f:semibold pl:1rem">Music</h1>
  <div class="music-library-container">
    <div class="songItem" v-for="song in musicLibrary.getSongsInfo()">
      <img
        v-if="song[1].getFrontCoverURL() != undefined"
        :src="song[1].getFrontCoverURL()"
        alt=""
        class="aspect:1/1 w:3rem r:8px"
        @click="loadAndPlaySong(song[0])"
      />
      <p class="pl:1rem">{{ song[1].getMetadata()?.title }}</p>
      <p>{{ song[1].getMetadata()?.artist }}</p>
      <p class="hidden@3xs block@xs">{{ song[1].getMetadata()?.album }}</p>
      <p class="hidden@3xs block@xs">{{ song[1].getMetadata()?.year }}</p>
      <p class="hidden@3xs block@xs">{{ song[1].getMetadata()?.genre }}</p>
      <p>{{ formatTime(song[1].getMetadata()?.duration) }}</p>
    </div>
  </div>
</template>

<style>
.music-library-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--color-text) transparent;
  scroll-behavior: smooth;
}

.songItem {
  max-height: 4rem;
  height: 4rem;
  min-height: 4rem;
  width: 100%;
  display: grid;
  grid-template-columns: 3rem 1fr 1fr 1fr;
  border-radius: 1rem;
  padding-left: 0.7rem;
}

.songItem:hover {
  background-color: rgba(48, 48, 48, 0.1);
}

@media (min-width: 600px) {
  .songItem {
    display: grid;
    grid-template-columns: 3rem 1fr 10% 20% 10% 10% 10%;
  }
}

.songItem {
  content-visibility: auto;
  font-weight: 600;
}

.songItem * {
  align-self: center;
  overflow: hidden;
}
</style>
