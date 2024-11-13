<script setup lang="ts">
import { inject, ref, Ref } from "vue"
import { SongInfo } from "../lib/songInfo"
import type { MusicLibrary } from "../lib/musicLibrary"
import { watch } from "vue"

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
  console.log(`musicLibrary.getSongsInfo() has changed to ${newVal}`)
})
</script>

<template>
  <div class="view flex-direction:column gap:1rem max-h:80vh max-w:80vw">
    <h1>Music</h1>
    <button @click="">Select song</button>
    <div
      v-for="song in musicLibrary.getSongsInfo()"
      class="songItem flex align-items::center max-h:5rem gap:1rem align-items:center f:medium place-content:space-between"
    >
      <img
        v-if="song[1].getFrontCoverURL() != undefined"
        :src="song[1].getFrontCoverURL()"
        alt=""
        class="aspect:1/1 w:3rem r:5px"
      />
      <p>{{ song[1].getMetadata()?.title }}</p>
      <p>{{ song[1].getMetadata()?.artist }}</p>
      <p>{{ song[1].getMetadata()?.album }}</p>
      <p>{{ song[1].getMetadata()?.year }}</p>
      <p>{{ song[1].getMetadata()?.genre }}</p>
      <p>{{ song[1].getMetadata()?.duration }}</p>
      <button @click="loadAndPlaySong(song[0])">Play Song</button>
    </div>
  </div>
</template>

<style>
.view {
  overflow-y: scroll;
}

.songItem {
  content-visibility: auto;
}
</style>
