<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref } from "vue"
import SongInfo from "lib/songInfo"
import { base64ToUint8Array } from "uint8array-extras"

const actualSongURL: Ref<string | undefined> = inject("actualSongURL", ref(""))
const actualSongInfo: Ref<SongInfo | null> = inject("actualSongInfo", ref(null))
const actualSongFrontCoverURL: Ref<string> = inject(
  "actualSongFrontCoverURL",
  ref(""),
)
</script>

<template>
  <div id="player" class="player">
    <div class="player-content">
      <div class="pl:2rem pr:1rem">
        <img
          :src="actualSongFrontCoverURL"
          alt="Song Front Cover"
          class="aspect:1/1 w:5rem r:1rem"
        />
      </div>
      <div class="flex flex:column place-content:space-between">
        <p class="f:medium f:20">{{ actualSongInfo?.title }}</p>
        <p class="f:medium f:16 f:gray">
          {{ actualSongInfo?.artist }} - {{ actualSongInfo?.album }}
        </p>
      </div>
    </div>
    <audio :src="actualSongURL" class="" autoplay></audio>
  </div>
</template>

<style>
.player {
  max-width: 100dvw;
  min-width: 100dvw;
  width: 100dvw;
  position: relative;
  background-image: var(--player-background-img);
  background-size: cover;
  background-position-y: center;
}

.player::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.6
  ); /* Color de fondo del seudoelemento */
  mix-blend-mode: multiply; /* Modo de mezcla para crear el efecto de transparencia */
  backdrop-filter: blur(20px);
}

.player-content {
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  place-content: center;
  flex-flow: row nowrap;
}

/* @media (min-width: 500px) {
  .player {
    background: green;
  }
}
@media (min-width: 800px) {
  .player {
    background: blue;
  }
}
@media (min-width: 1280px) {
  .player {
    background: red;
  }
}
@media (min-width: 1920px) {
  .player {
    background: brown;
  }
}
@media (min-width: 2560px) {
  .player {
    background: yellow;
  }
} */
</style>
