<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  provide,
  readonly,
  ref,
  Ref,
  watchEffect,
  ComputedRef,
} from "vue";
import "node:path";
import "node:fs";
import { ipcRenderer } from "electron";
import TitleBar from "./components/TitleBar.vue";
import PlayerComponent from "./components/PlayerComponent.vue";
import { watch } from "node:fs";
import SongInfo from "../lib/songInfo";
import { base64ToUint8Array } from "uint8array-extras";
import Menu from "./components/MenuComponent.vue";

/* Music library */

const musicLibraryPaths: Ref<string[]> = ref([
  "C:\\Users\\jorge\\Music\\Música No Original",
]);

const isFullScreen: Ref<boolean | undefined> = ref(undefined);

const actualSongURL: Ref<string> = ref("");
const actualSongInfo: Ref<SongInfo | null> = ref(null);
const actualSongFrontCoverURL: Ref<string> = ref("");

const songsLibrary: Ref<Map<string, SongInfo>> = ref(new Map());
const songsUrlLibrary: Ref<string[]> = ref([]);

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

const playSong = async (songPath: string) => {
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

// testing
onMounted(() => {
  updateSongs();
});

provide("addMusicLibraryPath", addMusicLibraryPath);
provide("removeMusicLibraryPath", removeMusicLibraryPath);
provide("musicLibraryPaths", readonly(musicLibraryPaths));
provide("updateSongs", updateSongs);
provide("playSong", playSong);
provide("actualSongURL", actualSongURL);
provide("actualSongInfo", actualSongInfo);
provide("actualSongFrontCoverURL", actualSongFrontCoverURL);

/* WARNING: This maybe doesn't be used */
provide("songsLibraryURL", songsUrlLibrary);
provide("songsLibrary", songsLibrary);
</script>

<template>
  <TitleBar v-if="!isFullScreen" />
  <main v-if="isFullScreen" class="fullscreen">
    <div class="fullscreen-content">
      <div>
        <img
          v-if="actualSongInfo != undefined"
          :src="getURL(actualSongInfo.frontCover)"
          alt=""
          class="aspect:1/1 r:2rem w:20rem"
        />
        <p class="text:center f:medium f:26">{{ actualSongInfo?.title }}</p>
        <p class="text:center f:medium f:22">{{ actualSongInfo?.album }}</p>
        <p class="text:center f:medium f:20">{{ actualSongInfo?.artist }}</p>
      </div>
    </div>
    <PlayerComponent />
  </main>
  <main v-else class="not-fullscreen">
    <Menu />
    <div>
      <RouterView />
    </div>
    <PlayerComponent />
  </main>
</template>

<style>
#app {
  padding-top: 2rem;
}

.fullscreen {
  width: 100%;

  position: relative;
  background-image: var(--player-background-img);
  background-size: cover;
  background-position-y: center;
}

.fullscreen::before {
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
  backdrop-filter: blur(50px);
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  place-content: center;
  flex-flow: row nowrap;
}
</style>
