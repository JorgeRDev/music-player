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
} from "./lib/musicPlayer"
import { isFullScreen } from "./lib/fullscreen"
import pino, { Logger } from "pino"
import { isDragging, tempSliderValue } from "./lib/progressBar"
const logger: Logger<never, boolean> = pino({
  level: "silent",
})
import ProgressBar from "./components/controls/PlaybackPositionSlider.vue"
import Lyrics from "./components/ui/Lyrics.vue"
onMounted(() => {
  logger.info("App mounted")

  window.App.Configuration.readConfiguration()
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
  <main v-if="isFullScreen" class="fullscreen cursor:none">
    <div class="bg:rgba(0,0,0,0.377) h:100vh">
      <div class="fullscreen-content text-align:center gap:3rem mt:1.5rem">
        <div class="flex flex:column align-items:center">
          <div
            class="aspect:1/1 h:24.6rem flex r:3rem place-content:center align-items:center shadow:0|0|20rem|10rem|rgba(0,0,0,0.151)"
          >
            <div
              class="aspect:1/1 overflow:hidden r:2.8rem h:24rem flex place-content:center align-items:center"
            >
              <img
                v-if="actualSong != undefined"
                :src="actualSong.getFrontCoverURL()"
                alt=""
                class="object-fit:cover aspect:1/1 r:2.3rem h:24rem shadow:2|2|120rem|15rem|rgba(131,131,131,0.082)"
              />
            </div>
          </div>
        </div>
        <div class="">
          <p
            class="font-color:white opacity:0.8 f:medium f:26 text-shadow:0|0|30|rgba(255,255,255,0.3)"
          >
            {{ actualSong?.getMetadata()?.title }}
          </p>
          <p
            class="font-color:white opacity:0.6 f:medium f:22 text-shadow:0|0|30|rgba(255,255,255,0.4)"
          >
            {{ actualSong?.getMetadata()?.album }}
          </p>
          <p
            class="font-color:white opacity:0.6 f:medium f:20 text-shadow:0|0|30|rgba(255,255,255,0.5)"
          >
            {{ actualSong?.getMetadata()?.artist }}
          </p>
        </div>
        <div class="w:40rem">
          <ProgressBar />
        </div>
        <Lyrics class="f:white" />
      </div>
    </div>
    <PlayerComponent />
  </main>
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

.fullscreen {
  width: 100%;

  position: relative;
  background-image: var(--player-background-img);
  background-size: cover;
  background-position-y: center;
  background-color: rgba(255, 255, 255, 0.2);
}

.fullscreen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: multiply;
  backdrop-filter: blur(35px);
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  place-content: center;
  flex-flow: column nowrap;
}
</style>
