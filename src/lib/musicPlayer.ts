import { ref, Ref } from "vue";
import { MusicLibrary } from "./MusicLibrary";
import { SongInfo } from "./songInfo";

const actualSong: SongInfo = new SongInfo();

const musicLibrary: MusicLibrary = new MusicLibrary();
const actualSongURL: Ref<SongPath> = ref("");
const actualSongInfo: Ref<SongData | null> = ref(null);
const actualSongFrontCoverURL: Ref<SongPath> = ref("");
const songsLibrary: Ref<Map<string, SongData>> = ref(new Map());
const songsUrlLibrary: Ref<SongPath[]> = ref([]);

const musicQueue: Ref<SongPath[]> = ref([]);

async function updateSongs() {
  console.log("executing updateSong()");

  const musicLibraryPathsValue: string[] = musicLibrary
    .getMusicLibraryPaths()
    .map((path) => path);

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
}

async function playSong(songPath: SongPath) {
  console.log(`playing ${songPath}`);

  actualSong.clearAll();

  const songBuffer: Buffer | undefined =
    await window.MusicManager.getSong(songPath);

  if (songBuffer != undefined) {
    actualSong.setBuffer(songBuffer);
    actualSong.createBlobFromBuffer();
    actualSong.createURLFromBlob();
  } else {
    throw new Error("Song buffer is undefined");
  }

  actualSong.createFrontCoverURL();

  const styles = document.styleSheets[0];
  if (styles != null) {
    const url = `url(${actualSong.getFrontCoverURL()})`;
    console.log(`updating ${styles} with the value ${url}`);

    styles.insertRule(
      `:root { --player-background-img: ${url}; }`,
      styles.cssRules.length
    );
  }
}

export {
  actualSong,
  musicLibrary,
  actualSongURL,
  actualSongInfo,
  actualSongFrontCoverURL,
  songsLibrary,
  songsUrlLibrary,
  updateSongs,
  playSong,
};
/* const songBuffer = await window.MusicManager.getSong(songPath);
  if (songBuffer != undefined) {
    const songBlob = new Blob([songBuffer]);
    actualSongURL.value = URL.createObjectURL(songBlob);

    actualSongInfo.value = await window.MusicManager.getSongInfo(songBuffer);
  }

  actualSongFrontCoverURL.value = getURL(actualSongInfo.value?.frontCover);

}
/* import { ref, Ref } from "vue";
import type SongInfo from "./songInfo";
import { base64ToUint8Array } from "uint8array-extras";



// Create a state object to hold all reactive references
export const state = {
  musicLibraryPaths: ref<string[]>([]),
  actualSongURL: ref<SongPath>(""),
  actualSongInfo: ref<SongInfo | null>(null),
  actualSongFrontCoverURL: ref<SongPath>(""),
  songsLibrary: ref<Map<string, SongInfo>>(new Map()),
  songsUrlLibrary: ref<SongPath[]>([]),
  musicQueue: ref<SongPath[]>([]),
};

// Create an actions object to hold all functions
export const actions = {
  addMusicLibraryPath: (dir: string) => {
    if (dir) {
      state.musicLibraryPaths.value.push(dir);
    }
  },

  removeMusicLibraryPath: (index: number) => {
    state.musicLibraryPaths.value.splice(index, 1);
  },

  getURL: (data: string | undefined) => {
    if (data != undefined) {
      const frontCoverBlob = new Blob([base64ToUint8Array(data)], {
        type: "image",
      });
      return URL.createObjectURL(frontCoverBlob);
    }
  },

  playSong: async (songPath: SongPath) => {
    console.log(`executing playSong()`);

    const songBuffer = await window.MusicManager.getSong(songPath);
    if (songBuffer != undefined) {
      const songBlob = new Blob([songBuffer]);
      state.actualSongURL.value = URL.createObjectURL(songBlob);
      state.actualSongInfo.value =
        await window.MusicManager.getSongInfo(songBuffer);
    }

    state.actualSongFrontCoverURL.value =
      actions.getURL(state.actualSongInfo.value?.frontCover) || "";

    const styles = document.styleSheets[0];
    if (styles != null) {
      const url = `url(${state.actualSongFrontCoverURL.value})`;
      styles.insertRule(
        `:root { --player-background-img: ${url}; }`,
        styles.cssRules.length
      );
    }
  },

  updateSongs: async () => {
    console.log("executing updateSong()");
    const songsLocated = await window.MusicManager.getSongsInfoFromDirectories(
      state.musicLibraryPaths.value
    );

    if (songsLocated) {
      state.songsLibrary.value = new Map(songsLocated);
      console.log(state.songsLibrary.value);
    }
  },
};

// Export everything as a single object if needed
export default {
  state,
  actions,
};
 */
