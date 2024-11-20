<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import type { MusicLibrary } from "../../lib/musicLibrary"
import pino, { Logger } from "pino"

const logger: Logger<never, boolean> = pino({ level: "silent" })

const musicLibrary: MusicLibrary = inject("musicLibrary") as MusicLibrary

const chooseDirectories = async () => {
  logger.info(`executing chooseDirectories()`)

  logger.info(`user is choosing directories`)

  const directories: string[] | null =
    await window.FileSystem.chooseDirectories()

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
    <button
      @click="chooseDirectories()"
      class="bg:$(color-ui-background) bg:$(color-ui-background-hover):hover r:0.4rem p:0.5rem"
    >
      Add folder
    </button>
  </div>
  <div class="flex flex-direction:column">
    <div
      v-if="musicLibrary.getMusicLibraryPaths().length > 0"
      v-for="(musicLibraryPath, index) in musicLibrary.getMusicLibraryPaths()"
      :key="index"
      class="flex place-content:space-between"
    >
      <p>{{ musicLibraryPath }}</p>
      <button
        @click="musicLibrary.removeMusicLibraryPath(index)"
        class="bg:$(color-ui-background) bg:$(color-ui-background-hover):hover r:0.4rem p:0.5rem"
      >
        Remove Library
      </button>
    </div>
  </div>
</template>
