<script setup lang="ts">
  import { inject } from "vue"

  import ActualSong from "../../../lib/actualSong"
  import ProgressBar from "../controls/PlaybackPositionSlider.vue"
  import Lyrics from "./Lyrics.vue"
  import FrontCover from "./FrontCover.vue"

  const actualSong = inject(
    "actualSong",
    new ActualSong()
  )
</script>

<template>
  <main class="fullscreen cursor:none">
    <div class="bg:rgba(0,0,0,0.377) h:100vh">
      <div
        class="fullscreen-content text-align:center gap:3rem mt:3rem"
      >
        <div
          class="flex flex:column align-items:center"
        >
          <div
            class="aspect:1/1 h:24.6rem flex r:20% place-content:center align-items:center shadow:0|0|20rem|10rem|rgba(0,0,0,0.151)"
          >
            <FrontCover
              :front-cover-url="
                actualSong.frontCoverURL
              "
            />
            <!-- <div
              class="aspect:1/1 overflow:hidden r:2.8rem h:24rem flex place-content:center align-items:center"
            >
              <img
                v-if="actualSong != undefined"
                :src="actualSong.getFrontCoverURL()"
                alt=""
                class="object-fit:cover aspect:1/1 r:2.3rem h:24rem shadow:2|2|120rem|15rem|rgba(131,131,131,0.082)"
              />
            </div> -->
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
            {{
              actualSong?.getMetadata()?.artist
            }}
          </p>
        </div>
        <div class="w:40rem">
          <ProgressBar />
        </div>
        <div class="h:10rem w:100%">
          <Lyrics :is-full-screen="true" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .fullscreen {
    width: 100%;

    position: relative;
    background-image: var(
      --player-background-img
    );
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
