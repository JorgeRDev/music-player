<script setup lang="ts">
import { inject, provide, readonly, ref, Ref, watchEffect } from "vue";
import "node:path";
import "node:fs";
import TitleBar from "./components/TitleBar.vue";
import PlayerComponent from "./components/PlayerComponent.vue";
import type SongInfo from "../lib/songInfo";
import { base64ToUint8Array } from "uint8array-extras";
import Menu from "./components/MenuComponent.vue";

const musicLibraryPaths: Ref<string[]> = ref([]);

const isFullScreen: Ref<boolean | undefined> = ref(undefined);

const actualSongURL: Ref<SongPath> = ref("");
const actualSongInfo: Ref<SongInfo | null> = ref(null);
const actualSongFrontCoverURL: Ref<SongPath> = ref("");

const songsLibrary: Ref<Map<string, SongInfo>> = ref(new Map());
const songsUrlLibrary: Ref<SongPath[]> = ref([]);

const addMusicLibraryPath = (dir: string) => {
  if (dir) {
    musicLibraryPaths.value.push(dir);
  }
};
const removeMusicLibraryPath = (index: number) => {
  musicLibraryPaths.value.splice(index, 1);
};

const updateSongs = async () => {
  console.log("executing updateSong()");

  const musicLibraryPathsValue: string[] = musicLibraryPaths.value.map(
    (path) => path
  );

  const songsLocated: Map<string, SongInfo> | null =
    await window.MusicManager.getSongsInfoFromDirectories(
      musicLibraryPathsValue
    );

  if (songsLocated != undefined) {
    for (const song of songsLocated) {
      console.log(song);
      songsLibrary.value.set(song[0], song[1]);
    }

    console.log(songsLibrary);
  }
};

const getURL = (data: string | undefined) => {
  if (data != undefined) {
    const frontCoverBlob = new Blob([base64ToUint8Array(data)], {
      type: "image",
    });
    const frontCoverURL = URL.createObjectURL(frontCoverBlob);

    return frontCoverURL;
  }
};

const playSong = async (songPath: SongPath) => {
  console.log(`executing playSong()`);

  const songBuffer = await window.MusicManager.getSong(songPath);
  if (songBuffer != undefined) {
    const songBlob = new Blob([songBuffer]);
    actualSongURL.value = URL.createObjectURL(songBlob);

    actualSongInfo.value = await window.MusicManager.getSongInfo(songBuffer);
  }

  actualSongFrontCoverURL.value = getURL(actualSongInfo.value?.frontCover);

  const styles = document.styleSheets[0];
  if (styles != null) {
    const url = `url(${actualSongFrontCoverURL.value})`;
    console.log(`updating ${styles} with the value ${url}`);

    styles.insertRule(
      `:root { --player-background-img: ${url}; }`,
      styles.cssRules.length
    );
  }
};

const theme: Ref<"light" | "dark" | "system" | undefined> = inject(
  "theme",
  ref("system")
);

watchEffect(() => {
  window.App.onFullScreen((_isFullScreen) => {
    console.log(_isFullScreen);

    isFullScreen.value = _isFullScreen;
  });
});

provide("addMusicLibraryPath", addMusicLibraryPath);
provide("removeMusicLibraryPath", removeMusicLibraryPath);
provide("musicLibraryPaths", readonly(musicLibraryPaths));
provide("updateSongs", updateSongs);
provide("playSong", playSong);
provide("actualSongURL", actualSongURL);
provide("actualSongInfo", actualSongInfo);
provide("actualSongFrontCoverURL", actualSongFrontCoverURL);
provide("isFullScreen", isFullScreen);

/* WARNING: This maybe doesn't be used */
provide("songsLibraryURL", songsUrlLibrary);
provide("songsLibrary", songsLibrary);
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
                v-if="actualSongInfo != undefined"
                :src="getURL(actualSongInfo.frontCover)"
                alt=""
                class="object-fit:cover aspect:1/1 r:2.3rem w:24rem shadow:2|2|120rem|15rem|rgba(131,131,131,0.082)"
              />
            </div>
          </div>
        </div>
        <div class="">
          <p
            class="f:white f:medium f:26 text-shadow:0|0|10|rgba(218,218,218,0.432) border"
          >
            {{ actualSongInfo?.title }}
          </p>
          <p
            class="f:white f:medium f:22 text-shadow:0|0|10|rgba(214,214,214,0.568)"
          >
            {{ actualSongInfo?.album }}
          </p>
          <p
            class="f:white f:medium f:20 text-shadow:0|0|10|rgba(207,207,207,0.699)"
          >
            {{ actualSongInfo?.artist }}
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
  <audio :src="actualSongURL" class="" autoplay loop></audio>
</template>

<style>
#app {
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
  /* Color de fondo del seudoelemento */
  mix-blend-mode: multiply; /* Modo de mezcla para crear el efecto de transparencia */
  backdrop-filter: blur(30px);
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
