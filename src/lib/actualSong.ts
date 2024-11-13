import { SongInfo } from "./songInfo"
import { Howl } from "howler"
import pino, { Logger } from "pino"
import Song from "./song"

const logger: Logger<never, boolean> = pino()

export default class actualSong extends Song {
  song: Howl | undefined

  async loadSong(songPath: SongPath) {
    logger.info(`loading song ${songPath}`)
    this.disposeAll()

    logger.trace(`setting songPath to ${songPath}`)
    this.songPath = songPath
    logger.trace(`setting buffer`)
    await this.createBuffer()
    logger.trace(`creating blob from buffer`)
    this.createBlobFromBuffer()
    logger.trace(`creating url from blob`)
    this.createURLFromBlob()

    if (this.url === undefined) {
      throw new Error(
        "URL is undefined. Try calling createURLFromBlob() first before loading the song",
      )
    }

    logger.trace(`creating howl with ${this.url}`)
    this.song = new Howl({
      src: [this.url],
      html5: true,
    })

    logger.trace(`creating metadata from buffer`)
    await this.getMetadataFromSongPath()
    logger.trace(`creating front cover url`)
    this.getFrontCoverURL()
  }

  disposeAll(): void {
    logger.info(`executing disposeAll()`)
    logger.trace(`disposing blob and buffer`)

    this.disposeBlobAndBuffer()

    if (this.songMetadata) {
      this.songMetadata = undefined
    }

    if (this.frontCoverURL) {
      URL.revokeObjectURL(this.frontCoverURL)
      this.frontCoverURL = undefined
    }

    if (this.frontCoverBlob) {
      this.frontCoverBlob = undefined
    }

    if (this.song) {
      this.song.unload()
      this.song = undefined
    }
  }
}
