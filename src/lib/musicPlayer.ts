import { ref, Ref } from "vue"
import { MusicLibrary } from "./musicLibrary"
import { SongInfo } from "./songInfo"
import { inject } from "vue"
import pino, { Logger } from "pino"
import ActualSong from "./actualSong"

const logger: Logger<never, boolean> = pino()

const actualSong: Ref<ActualSong> = ref(new ActualSong())

const musicLibrary: MusicLibrary = new MusicLibrary()

const musicQueue: Ref<SongPath[]> = ref([])

/**
 * Vue function
 * @param songPath - The path of the song to play
 */
async function loadAndPlaySong(songPath: SongPath) {
  logger.info(`executing loadAndPlaySong(${songPath})`)

  await actualSong.value.loadSong(songPath)
  await actualSong.value.play()

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

export { actualSong, musicLibrary, loadAndPlaySong }
