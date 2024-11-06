<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"

const musicLibraryPaths: Ref<string[]> = inject("musicLibraryPaths", ref([]))

const addMusicLibraryPath = inject("addMusicLibraryPath", (dir: string) => {
  if (dir) {
    musicLibraryPaths.value.push(dir)
  }
})

const removeMusicLibraryPath = inject(
  "removeMusicLibraryPath",
  (index: number) => {
    musicLibraryPaths.value.splice(index, 1)
  },
)

const musicLibraryPathsIsNotEmpty = computed(
  () => musicLibraryPaths.value.length >= 1,
)

const songsLibrary: Ref<string[]> = inject("songsLibrary", ref([]))

const updateSongs = inject("updateSongs", async () => {
  const musicLibraryPathsValue: string[] = musicLibraryPaths.value.map(
    (path) => path,
  )

  const songsLocated: string[] | null =
    await window.MusicManager.getSongsInfoFromDirectories(
      musicLibraryPathsValue,
    )

  if (songsLocated != undefined) {
    songsLibrary.value = songsLocated
  }
  console.log(songsLibrary)
})

const chooseDirectories = async () => {
  const directories: string[] | null =
    await window.FileSystem.chooseDirectories()
  console.log(`selectDirectories() has received ${directories}`)

  if (directories) {
    for (const directory of directories) addMusicLibraryPath(directory)
  }

  updateSongs()
}
</script>

<template>
  <div class="setting">
    <div class="flex">
      <p>Music locations</p>
      <button @click="chooseDirectories()">Add folder</button>
      <button v-if="musicLibraryPathsIsNotEmpty">Abrir</button>
    </div>
    <div class="flex flex-direction:column">
      <div
        v-if="musicLibraryPathsIsNotEmpty"
        v-for="(musicLibraryPath, index) in musicLibraryPaths.values()"
        :key="index"
        class="b"
      >
        <p>{{ index }}</p>
        <p>{{ musicLibraryPath }}</p>
        <button @click="removeMusicLibraryPath(index)">Remove Library</button>
      </div>
    </div>
  </div>
</template>
