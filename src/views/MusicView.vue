<script setup lang="ts">
import SongInfo from "lib/songInfo"
import { base64ToUint8Array } from "uint8array-extras"
import { inject, ref, Ref } from "vue"

const actualSong: Ref<string> = inject("actualSong", ref("There is no song"))

const playSong = inject("playSong", async (songPath: string) => {
  console.log(`executing playSong()`)

  const songBuffer = await window.MusicManager.getSong(songPath)
  if (songBuffer != undefined) {
    const songBlob = new Blob([songBuffer])
    actualSong.value = URL.createObjectURL(songBlob)
  }
})

const songsLibrary: Ref<Map<string, SongInfo>> = inject(
  "songsLibrary",
  ref(new Map()),
)

const getURL = inject("getUrl", (data: string | undefined) => {
  if (data != undefined) {
    const frontCoverBlob = new Blob([base64ToUint8Array(data)], {
      type: "image",
    })
    const frontCoverURL = URL.createObjectURL(frontCoverBlob)

    return frontCoverURL
  }
})
</script>

<template>
  <div class="view flex-direction:column gap:1rem max-h:80vh">
    <h1>Music</h1>
    <button @click="">Select song</button>
    <div
      v-for="song in songsLibrary"
      class="flex align-items::center max-h:5rem gap:1rem align-items:center f:medium place-content:space-between"
    >
      <img
        v-if="getURL(song[1].frontCover) != undefined"
        :src="getURL(song[1].frontCover)"
        alt=""
        class="aspect:1/1 w:3rem r:5px"
      />
      <p>{{ song[1].title }}</p>
      <p>{{ song[1].artist }}</p>
      <p>{{ song[1].album }}</p>
      <p>{{ song[1].year }}</p>
      <p>{{ song[1].genre }}</p>
      <p>{{ song[1].duration }}</p>
      <button @click="playSong(song[0])">Play Song</button>
    </div>
  </div>
</template>

<style>
.view {
  overflow-y: scroll;
}
</style>
