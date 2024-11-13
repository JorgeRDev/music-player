<script setup lang="ts">
import {
  inject,
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
import { loadAndPlaySong, actualSong, musicLibrary } from "./lib/musicPlayer"
import { isFullScreen } from "./lib/fullscreen"
import pino, { Logger } from "pino"

const logger: Logger<never, boolean> = pino({
  level: "trace",
})

onMounted(() => {
  logger.trace("App mounted")
})

/* const theme: Ref<"light" | "dark" | "system" | undefined> = inject(
  "theme",
  ref("system"),
) */

watchEffect(() => {
  logger.info()
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
</script>

<template>
  <TitleBar v-if="!isFullScreen" />
  <main v-show="isFullScreen" class="fullscreen cursor:none">
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
            class="f:white f:medium f:26 text-shadow:0|0|30|rgba(255,255,255,0.3)"
          >
            {{ actualSong?.getMetadata()?.title }}
          </p>
          <p
            class="f:white f:medium f:22 text-shadow:0|0|30|rgba(255,255,255,0.4)"
          >
            {{ actualSong?.getMetadata()?.album }}
          </p>
          <p
            class="f:white f:medium f:20 text-shadow:0|0|30|rgba(255,255,255,0.5)"
          >
            {{ actualSong?.getMetadata()?.artist }}
          </p>
        </div>
      </div>
    </div>
    <PlayerComponent />
  </main>
  <main v-show="!isFullScreen" class="not-fullscreen mt:2rem">
    <Menu />
    <div>
      <KeepAlive include="home, settings">
        <RouterView />
      </KeepAlive>
    </div>
    <PlayerComponent />
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
