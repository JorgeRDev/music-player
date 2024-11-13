import { ref, Ref } from "vue"
import { MusicLibrary } from "./musicLibrary"
import { SongInfo } from "./songInfo"
import { inject } from "vue"
import pino, { Logger } from "pino"
import actualSong from "./actualSong"

const logger: Logger<never, boolean> = pino()

const actualSong: Ref<actualSong | undefined> = ref(undefined)

const musicLibrary: MusicLibrary = new MusicLibrary()

const musicQueue: Ref<SongPath[]> = ref([])

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
