import pino from "pino"
import { base64ToUint8Array } from "uint8array-extras"

const logger = pino()

/**
 * Base class that contains all the necessary properties and methods to represent songs.
 * This class serves as a foundation for subclasses that need to handle song-related functionality,
 * such as currently playing songs or song information display.
 * It manages song data like buffers, blobs, metadata and cover art.
 */

export default class Song {
  songPath: SongPath | undefined
  buffer: Buffer | undefined
  blob: Blob | undefined
  url: string | undefined
  songMetadata: SongMetadata | undefined
  frontCoverBlob: Blob | undefined
  frontCoverURL: string | undefined

  /**
   * Creates a buffer from the song path stored in this instance
   * @returns {Promise<Buffer>} A buffer containing the song data, or undefined if the song cannot be loaded
   * @throws {Error} If songPath is undefined
   */
  async createBuffer(): Promise<Buffer> {
    logger.info("executing createBuffer()")
    logger.trace(`creating buffer from ${this.songPath}`)
    /**
     * Creates a buffer from the song path stored in this instance
     * @returns {Promise<Buffer|undefined>} A buffer containing the song data, or undefined if the song cannot be loaded
     * @throws {Error} If songPath is undefined
     */
    let _buffer: Buffer | undefined

    try {
      _buffer = await window.MusicManager.getSongBuffer(this.songPath)
    } catch (err) {
      throw err
    }

    if (_buffer === undefined) {
      throw new Error("Buffer is undefined")
    }

    this.buffer = _buffer
  }

  createBlobFromBuffer() {
    logger.info(`executing createBlobFromBuffer()`)
    logger.trace(`creating blob from buffer`)

    if (this.buffer === undefined) {
      throw new Error(
        "Buffer is undefined. Try calling createBuffer() first before creating a blob",
      )
    }

    this.blob = new Blob([this.buffer])
  }

  createURLFromBlob() {
    logger.info(`executing createURLFromBlob()`)
    logger.trace(`creating url from blob`)

    if (this.blob === undefined) {
      throw new Error(
        "Blob is undefined. Try calling createBlobFromBuffer() first before creating a url",
      )
    }

    this.url = URL.createObjectURL(this.blob)
  }

  async getMetadataFromSongPath() {
    logger.info(`executing getMetadataFromSongPath()`)
    logger.trace(`getting metadata from song path`)

    if (this.songPath === undefined) {
      throw new Error(
        "Song path is undefined. Try setting the songPath first before getting metadata",
      )
    }

    this.songMetadata = await window.MusicManager.getSongMetadata(this.songPath)
  }

  createFrontCoverBlob() {
    logger.info(`executing createFrontCoverBlob()`)
    logger.trace(`creating front cover blob`)

    if (this.songMetadata === undefined) {
      throw new Error(
        "Song metadata is undefined. Try calling getMetadataFromSongPath() first before creating a front cover blob",
      )
    }

    if (this.songMetadata.frontCover === undefined) {
      throw new Error(
        "Front cover is undefined. The song does not have a front cover",
      )
    }

    this.frontCoverBlob = new Blob([
      base64ToUint8Array(this.songMetadata.frontCover),
    ])
  }

  getURL() {
    return this.url
  }

  getFrontCoverURL() {
    return this.frontCoverURL
  }

  getMetadata() {
    return this.songMetadata
  }

  disposeBlobAndBuffer() {
    if (this.url) {
      URL.revokeObjectURL(this.url)
      this.url = undefined
    }

    if (this.blob) {
      this.blob = undefined
    }

    if (this.buffer) {
      this.buffer = undefined
    }
  }

  disposeAll() {
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
  }
}
