<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import type { MusicLibrary } from "../../lib/musicLibrary"
import Button from "../button/RemoveButton.vue"
import {useUserSettings} from "../../stores/userSettings.ts";


const userSettings = useUserSettings()

const musicLibrary: MusicLibrary = inject("musicLibrary") as MusicLibrary

const openDirectoriesSelectDialog = async () => {
  const directories: string[] | null =
    await window.App.FileSystem.openDirectoriesSelectDialog()

  if (directories) {
    for (const directory of directories) {
      userSettings.addMusicDirectory(directory)
    }
  }

  await musicLibrary.createSongsPathFromPaths()
  await musicLibrary.createSongsMetadataFromPaths()
}
</script>

<template>
  <div class="flex place-content:space-between">
    <section>Music library location</section>
    <Button @click="openDirectoriesSelectDialog()">Add folder</Button>
  </div>
  <div class="flex flex-direction:column py:1rem gap:1rem">
    <div
      v-if="userSettings.musicDirectories.length > 0"
      v-for="(musicLibraryPath, index) in userSettings.musicDirectories"
      :key="index"
      class="flex place-content:space-between align-items:center"
    >
      <p>{{ musicLibraryPath }}</p>
      <Button @click="userSettings.removeMusicDirectory(musicLibraryPath)" />
    </div>
  </div>
</template>
