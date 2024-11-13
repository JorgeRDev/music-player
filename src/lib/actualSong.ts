import { SongInfo } from "./songInfo"
import { Howl } from "howler"
import pino, { Logger } from "pino"

const logger: Logger<never, boolean> = pino()

export default class actualSong extends SongInfo {
  songPath: SongPath | undefined = undefined
  song: Howl | undefined

  async loadSong(songPath: SongPath) {
    logger.info(`loading song ${songPath}`)
    this.clearAll()

    logger.trace(`setting songPath to ${songPath}`)
    this.songPath = songPath
    logger.trace(`setting buffer`)
    await this.setBuffer()
    logger.trace(`creating blob from buffer`)
    this.createBlobFromBuffer()
    logger.trace(`creating url from blob`)
    this.createURLFromBlob()

    if (this.url != undefined) {
      logger.trace(`creating howl with ${this.url}`)
      this.song = new Howl({
        src: [this.url],
        html5: true,
      })
    }

    logger.trace(`creating metadata from buffer`)
    await this.createMetadataFromBuffer()
    logger.trace(`creating front cover url`)
    this.createFrontCoverURL()
  }

  clearAll(): void {
    logger.info(`clearing all`)
    this.clearBlobAndBuffer()

    if (this.url) {
      URL.revokeObjectURL(this.url)
      this.url = undefined
    }

    if (this.frontCoverURL) {
      URL.revokeObjectURL(this.frontCoverURL)
      this.frontCoverURL = undefined
      this.frontCoverBlob = undefined
    }

    this.songMetadata = undefined
    this.song?.unload()
    this.song = undefined
  }
}
