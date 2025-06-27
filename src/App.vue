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
import { isDragging, tempSliderValue } from "../lib/progressBar"
import { Configuration } from "../electron/core/configuration.ts"
import ProgressBar from "./components/controls/PlaybackPositionSlider.vue"
import Lyrics from "./components/ui/Lyrics.vue"
import Fullscreen from "./components/ui/Fullscreen.vue"
import {useAppState} from "./stores/appState.ts"
import {useUserSettings} from "./stores/userSettings.ts";

const appState = useAppState()
const userSettings = useUserSettings()

onMounted(async () => {
  await userSettings.loadConfiguration()

  for (const directory of userSettings.musicDirectories) {
    musicLibrary.addMusicLibraryPath(directory)
  }

  await musicLibrary.createSongsPathFromPaths()
  await musicLibrary.createSongsMetadataFromPaths()
})

/* const theme: Ref<"light" | "dark" | "system" | undefined> = inject(
  "theme",
  ref("system"),
) */

onBeforeUnmount(() => {
  musicLibrary.clearAll()
})

provide("musicLibrary", musicLibrary)
provide("loadAndPlaySong", loadAndPlaySong)
provide("isFullScreen", appState.fullscreen)
provide("actualSong", actualSong)
provide("actualDuration", actualDuration)
provide("totalDuration", totalDuration)
provide("isDragging", isDragging)
provide("tempSliderValue", tempSliderValue)
provide("playPauseSong", playPauseSong)
</script>

<template>
  <TitleBar v-if="!appState.fullscreen" />

  <Fullscreen v-if="appState.fullscreen" />

  <main
    v-if="!appState.fullscreen"
    class="relative height:100% padding-top:$(title-bar-height) max-w:100%"
  >
    <div class="flex flex:row pb:$(player-height) h:100% w:100%">
      <div class="flex-basis:32px flex-basis:230px@lg">
        <Menu />
      </div>
      <div class="block flex-grow:1 views pl:50px pl:10px@lg">
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
