<script setup lang="ts">
import {
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  readonly,
  ref,
  Ref,
  watchEffect,
} from "vue"
import "node:path"
import "node:fs"
import TitleBar from "./components/TitleBar.vue"
import PlayerComponent from "./components/PlayerComponent.vue"
import Menu from "./components/MenuComponent.vue"
import {
  loadAndPlaySong,
  actualSong,
  musicLibrary,
  actualDuration,
  totalDuration,
  playPauseSong,
} from "../lib/musicPlayer"
import { isFullScreen } from "../lib/fullscreen"
import pino, { Logger } from "pino"
import { isDragging, tempSliderValue } from "../lib/progressBar"
import { Configuration } from "../lib/configuration"
import ProgressBar from "./components/controls/PlaybackPositionSlider.vue"
import Lyrics from "./components/ui/Lyrics.vue"
import Fullscreen from "./components/ui/Fullscreen.vue"

const logger: Logger<never, boolean> = pino({
  level: "silent",
})
onMounted(async () => {
  logger.info("App mounted")

  const configuration: Configuration =
    await window.App.Configuration.readConfiguration()

  for (const directory of configuration.directories) {
    musicLibrary.addMusicLibraryPath(directory)
  }

  await musicLibrary.createSongsPathFromPaths()
  await musicLibrary.createSongsMetadataFromPaths()
})

/* const theme: Ref<"light" | "dark" | "system" | undefined> = inject(
  "theme",
  ref("system"),
) */

watchEffect(() => {
  window.App.FullScreen.onFullScreen((_isFullScreen) => {
    logger.info(`fullscreen event has returned ${_isFullScreen}`)

    isFullScreen.value = _isFullScreen
  })
})

onBeforeUnmount(() => {
  logger.trace("clearing all before unmounting")
  musicLibrary.clearAll()
})

provide("musicLibrary", musicLibrary)
provide("loadAndPlaySong", loadAndPlaySong)
provide("isFullScreen", isFullScreen)
provide("actualSong", actualSong)
provide("actualDuration", actualDuration)
provide("totalDuration", totalDuration)
provide("isDragging", isDragging)
provide("tempSliderValue", tempSliderValue)
provide("playPauseSong", playPauseSong)
</script>

<template>
  <TitleBar v-if="!isFullScreen" />

  <Fullscreen v-if="isFullScreen" />

  <main
    v-show="!isFullScreen"
    class="relative height:100% padding-top:$(title-bar-height) max-w:100%"
  >
    <div class="flex flex:row pb:$(player-height) h:100% w:100%">
      <div class="flex-basis:30%">
        <Menu />
      </div>
      <div class="views">
        <RouterView />
      </div>
    </div>
    <div
      class="abs bottom:0 left:0 min-h:$(player-height) height:$(player-height) max-h:$(player-height)"
    >
      <PlayerComponent />
    </div>
  </main>
</template>

<style scoped>
.views {
  display: none;
}

@media (min-height: 175px) {
  .views {
    display: block;
    flex-basis: 88%;
    max-height: 100%;
  }
}
</style>
