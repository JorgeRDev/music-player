import { ref, Ref } from "vue"
import { SongInfo } from "./songInfo"
import pino, { Logger } from "pino"

const logger: Logger<never, boolean> = pino({
  level: "silent",
})

class MusicLibrary {
  musicLibraryPaths: Ref<string[]> = ref([])
  songsPath: Ref<Set<SongPath>> = ref(new Set())
  songsInfo: Ref<Map<SongPath, SongInfo>> = ref(
    new Map()
  )

  constructor() {
    logger.info("MusicLibrary() has been created")
  }

  removeMusicLibraryPath(index: number) {
    this.musicLibraryPaths.value.splice(index, 1)
  }

  addMusicLibraryPath(dir: string) {
    logger.info(`executing addMusicLibraryPath()`)

    if (dir) {
      logger.info(
        `adding ${dir} to musicLibraryPaths`
      )
      this.musicLibraryPaths.value.push(dir)
      logger.info(this.musicLibraryPaths.value)
    }
  }

  getMusicLibraryPaths() {
    return this.musicLibraryPaths.value
  }

  async createSongsPathFromPaths() {
    logger.info(
      `executing createSongsPathFromPaths()`
    )
    logger.info(`clearing all`)
    this.clearAll()

    logger.info(
      `musicLibraryPaths has ${this.musicLibraryPaths.value}`
    )
    for (const path of this.musicLibraryPaths
      .value) {
      logger.info(
        `getting songs path from ${path}`
      )
      await window.App.MusicManager.getSongsPathFromDirectories(
        [path],
        (_songPath: string) => {
          logger.info(
            `getSongsPathFromDirectories() has recieved ${_songPath}`
          )
          this.songsPath.value.add(_songPath)
        }
      )
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    )
    logger.info(
      `songsPath has recieved ${this.songsPath.value.size} songs`
    )
    for (const songPath of this.songsPath.value) {
      logger.info(
        `songPath has recieved ${songPath}`
      )
    }
  }

  async createSongsMetadataFromPaths() {
    logger.info(
      `executing createSongsMetadataFromPaths()`
    )

    for (const songPath of this.songsPath.value) {
      logger.info(
        `getting songInfo from ${songPath}`
      )
      const _songInfo: SongInfo = new SongInfo(
        songPath
      )
      await _songInfo.init()
      this.songsInfo.value.set(
        songPath,
        _songInfo
      )
    }
  }

  clearAll() {
    for (const songInfo of this.songsInfo.value.values()) {
      songInfo.disposeAll()
    }
    this.songsInfo.value.clear()
    this.songsPath.value.clear()
  }
}

export { MusicLibrary }
