<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import type { MusicLibrary } from "../../lib/musicLibrary"
import pino, { Logger } from "pino"
import Button from "../button/RemoveButton.vue"

const logger: Logger<never, boolean> = pino({ level: "silent" })

const musicLibrary: MusicLibrary = inject("musicLibrary") as MusicLibrary

const openDirectoriesSelectDialog = async () => {
  logger.info(`executing chooseDirectories()`)

  logger.info(`user is choosing directories`)

  const directories: string[] | null =
    await window.App.FileSystem.openDirectoriesSelectDialog()

  logger.info(`chooseDirectories() has received ${directories}`)

  if (directories) {
    logger.info(`adding directories to musicLibrary`)
    for (const directory of directories) {
      logger.info(`${directory} is being added`)
      musicLibrary.addMusicLibraryPath(directory)
      logger.info(`${directory} has been added`)
    }

    logger.info(
      `musicLibraryPaths has ${musicLibrary.getMusicLibraryPaths().length} directories`,
    )
    logger.info(`musicLibraryPaths has ${musicLibrary.getMusicLibraryPaths()}`)
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
      v-if="musicLibrary.getMusicLibraryPaths().length > 0"
      v-for="(musicLibraryPath, index) in musicLibrary.getMusicLibraryPaths()"
      :key="index"
      class="flex place-content:space-between align-items:center"
    >
      <p>{{ musicLibraryPath }}</p>
      <Button @click="musicLibrary.removeMusicLibraryPath(index)" />
    </div>
  </div>
</template>
