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
} from "./lib/musicPlayer"
import { isFullScreen } from "./lib/fullscreen"
import pino, { Logger } from "pino"
import { isDragging, tempSliderValue } from "./lib/progressBar"
const logger: Logger<never, boolean> = pino({
  level: "silent",
})
import ProgressBar from "./components/musicplayer/ProgressBar.vue"

onMounted(() => {
  logger.trace("App mounted")
})

/* const theme: Ref<"light" | "dark" | "system" | undefined> = inject(
  "theme",
  ref("system"),
) */

watchEffect(() => {
  window.App.onFullScreen((_isFullScreen) => {
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
</script>

<template>
  <TitleBar v-if="!isFullScreen" />
  <main v-if="isFullScreen" class="fullscreen cursor:none">
    <div class="bg:rgba(0,0,0,0.377) h:100vh">
      <div class="fullscreen-content text-align:center">
        <div class="flex flex:column align-items:center">
          <div
            class="aspect:1/1 w:24.6rem flex r:3rem place-content:center align-items:center shadow:2|2|24rem|1rem|rgba(80,80,80,0.315) margin-bottom:3rem"
          >
            <div
              class="aspect:1/1 overflow:hidden r:2.8rem w:24rem max-w:24rem flex place-content:center align-items:center"
            >
              <img
                v-if="actualSong != undefined"
                :src="actualSong.getFrontCoverURL()"
                alt=""
                class="object-fit:cover aspect:1/1 r:2.3rem w:24rem shadow:2|2|120rem|15rem|rgba(131,131,131,0.082)"
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
        <div class="w:40rem mt:3rem">
          <ProgressBar />
        </div>
      </div>
    </div>
    <PlayerComponent />
  </main>
  <main
    v-if="!isFullScreen"
    class="relative height:100% padding-top:$(title-bar-height) max-w:100%"
  >
    <div class="flex flex:row pb:$(player-height) h:100% w:100%">
      <div class="flex-basis:12%">
        <Menu />
      </div>
      <div class="flex-basis:88% max-h:100% overflow-y:scroll">
        <RouterView />
      </div>
    </div>
    <div class="abs bottom:0 left:0 height:$(player-height)">
      <PlayerComponent />
    </div>
  </main>
</template>

<style scoped>
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
