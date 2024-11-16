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
  <div class="music-library-container">
    <div
      class="flex-shrink:0 sticky top:0 p:0|0|1rem|1rem bg:$(color-background)"
    >
      <h1 class="f:48">Music</h1>
      <!-- TODO: create views for songs, artists, albums, genres, etc -->
      <div class="flex gap:1rem place-content:center">
        <p class="f:gray">Songs</p>
        <p class="f:gray">Artists</p>
        <p class="f:gray">Albums</p>
        <p class="f:gray">Genres</p>
      </div>
    </div>
    <div class="music-library-content">
      <div class="song-list">
        <div class="songItem" v-for="song in musicLibrary.getSongsInfo()">
          <div
            class="aspect:1/1 w:3rem r:8px bg:rgba(0,0,0,0.479)"
            @click="loadAndPlaySong(song[0])"
          >
            <img
              v-if="song[1].getFrontCoverURL() != undefined"
              :src="song[1].getFrontCoverURL()"
              alt=""
            />
          </div>
          <p class="pl:1rem">{{ song[1].getMetadata()?.title }}</p>
          <p>{{ song[1].getMetadata()?.artist ?? "Unknown Artist" }}</p>
          <p class="hidden@3xs block@xs">
            {{ song[1].getMetadata()?.album ?? "Unknown Album" }}
          </p>
          <p class="hidden@3xs block@md">
            {{ song[1].getMetadata()?.year ?? "Unknown Year" }}
          </p>
          <div
            class="hidden@3xs block@md"
            v-for="genre in song[1].getMetadata()?.genre"
            v-if="song[1].songMetadata?.genre != undefined"
          >
            <p>{{ genre }}</p>
          </div>
          <div v-else>
            <p>Unknown Genre</p>
          </div>
          <p>{{ formatTime(song[1].getMetadata()?.duration ?? 0) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.music-library-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.music-library-content {
  flex: 1;
  height: 100%;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--color-text) transparent;
  overflow-x: hidden;
  background-color: rgba(71, 71, 71, 0.1);
  border-radius: 1rem 0 0 0;
  padding: 1rem;
  overflow-y: hidden;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--color-text) transparent;
}

.songItem {
  max-height: 4rem;
  height: 4rem;
  min-height: 4rem;
  width: 100%;
  display: grid;
  grid-template-columns: 3rem 1fr 1fr 3.5rem;
  border-radius: 1rem;
  padding-left: 0.7rem;
}

.songItem:hover {
  background-color: rgba(114, 114, 114, 0.3);
}

@media (min-width: 600px) {
  .songItem {
    display: grid;
    grid-template-columns: 3rem 1fr 1fr 1fr 3.5rem;
  }
}

@media (min-width: 1024px) {
  .songItem {
    grid-template-columns: 3rem 1fr 13% 30% 5% 15% 4rem;
    gap: 0.5rem;
  }
}

.songItem {
  overflow: hidden;
  white-space: nowrap;
}

.songItem * {
  text-overflow: ellipsis;
  align-self: center;
  overflow: hidden;
}
</style>
