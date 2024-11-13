import { ref, Ref } from "vue"
import { MusicLibrary } from "./musicLibrary"
import { SongInfo } from "./songInfo"

const actualSong: Ref<SongInfo | undefined> = ref(undefined)
const musicLibrary: MusicLibrary = new MusicLibrary()
const musicQueue: Ref<SongPath[]> = ref([])

async function initMusicLibrary() {
  console.log(`Executing createSongsPathFromPaths()`)
  await musicLibrary.createSongsPathFromPaths()
  await musicLibrary.createSongsInfoFromPaths()
}

await initMusicLibrary()
/* async function updateSongs() {
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
} */

async function playSong(songPath: SongPath) {
  console.log(`playing ${songPath}`)

  if (actualSong.value != undefined) {
    actualSong.value.clearAll()
  }

  actualSong.value = new SongInfo(songPath)
  const songBuffer: Buffer | undefined =
    await window.MusicManager.getSong(songPath)

  if (songBuffer != undefined) {
    await actualSong.value.setBuffer()
    actualSong.value.createBlobFromBuffer()
    actualSong.value.createURLFromBlob()
    await actualSong.value.createMetadataFromBuffer()
    actualSong.value.createFrontCoverURL()
  } else {
    throw new Error("Song buffer is undefined")
  }

  actualSong.value.createFrontCoverURL()

  const styles = document.styleSheets[0]
  if (styles != null) {
    const url = `url(${actualSong.value.getFrontCoverURL()})`
    console.log(`updating ${styles} with the value ${url}`)

    styles.insertRule(
      `:root { --player-background-img: ${url}; }`,
      styles.cssRules.length,
    )
  }
}

export { actualSong, musicLibrary, playSong }
