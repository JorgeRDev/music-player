import { ref, Ref } from "vue"
import { SongInfo } from "./songInfo"
import pino, { Logger } from "pino"

const logger: Logger<never, boolean> = pino()

class MusicLibrary {
  musicLibraryPaths: Ref<string[]> = ref([
    "C:\\Users\\jorge\\Music\\Música Original\\Panda Eyes",
  ])
  songsPath: Ref<Set<SongPath>> = ref(new Set())
  songsInfo: Ref<Map<SongPath, SongInfo>> = ref(new Map())

  constructor() {
    logger.info("MusicLibrary() has been created")
  }

  removeMusicLibraryPath(index: number) {
    this.musicLibraryPaths.value.splice(index, 1)
  }

  addMusicLibraryPath(dir: string) {
    console.log(`executing addMusicLibraryPath()`)

    if (dir) {
      console.log(`adding ${dir} to musicLibraryPaths`)
      this.musicLibraryPaths.value.push(dir)
      console.log(this.musicLibraryPaths.value)
    }
  }

  getMusicLibraryPaths() {
    return this.musicLibraryPaths.value
  }

  async createSongsPathFromPaths() {
    console.log(`executing createSongsPathFromPaths()`)
    console.log(`clearing all`)
    this.clearAll()

    console.log(`musicLibraryPaths has ${this.musicLibraryPaths.value}`)
    for (const path of this.musicLibraryPaths.value) {
      console.log(`getting songs path from ${path}`)
      await window.MusicManager.getSongsPathFromDirectories(
        [path],
        (_songPath: string) => {
          console.log(`getSongsPathFromDirectories() has recieved ${_songPath}`)
          this.songsPath.value.add(_songPath)
        },
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`songsPath has recieved ${this.songsPath.value.size} songs`)
    for (const songPath of this.songsPath.value) {
      console.log(`songPath has recieved ${songPath}`)
    }
  }

  async createSongsMetadataFromPaths() {
    console.log(`executing createSongsMetadataFromPaths()`)

    for (const songPath of this.songsPath.value) {
      console.log(`getting songInfo from ${songPath}`)
      const _songInfo: SongInfo = new SongInfo(songPath)
      await _songInfo.init()
      this.songsInfo.value.set(songPath, _songInfo)
    }
  }

  getSongsPath() {
    return this.songsPath.value
  }

  getSongsInfo() {
    return this.songsInfo.value
  }

  clearAll() {
    for (const songInfo of this.songsInfo.value.values()) {
      songInfo.clearAll()
    }
    this.songsInfo.value.clear()
    this.songsPath.value.clear()
  }
}

export { MusicLibrary }
