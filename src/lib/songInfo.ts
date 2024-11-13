import { base64ToUint8Array, uint8ArrayToBase64 } from "uint8array-extras"

class SongInfo {
  songPath: SongPath | undefined
  private buffer: Buffer | undefined
  blob: Blob | undefined
  url: string | undefined
  songMetadata: SongMetadata | undefined
  frontCoverURL: string | undefined
  frontCoverBlob: Blob | undefined
  constructor(songPath: SongPath) {
    console.log(`SongInfo() has been created with ${songPath}`)

    this.songPath = songPath
  }

  async setBuffer() {
    const _buffer: Buffer | undefined = await window.MusicManager.getSong(
      this.songPath,
    )

    if (_buffer != undefined) {
      this.buffer = _buffer
    } else {
      throw new Error("Buffer is undefined")
    }
  }

  setBlob(blob: Blob) {
    this.blob = blob
  }

  setURL(url: string) {
    this.url = url
  }

  getBuffer() {
    return this.buffer
  }

  getBlob() {
    return this.blob
  }

  getURL() {
    return this.url
  }

  createBlobFromBuffer() {
    if (this.buffer != undefined) {
      this.blob = new Blob([this.buffer])
    } else {
      throw new Error("Buffer is undefined")
    }
  }

  createURLFromBlob() {
    if (this.blob != undefined) {
      this.url = URL.createObjectURL(this.blob)
    } else {
      throw new Error("Blob is undefined")
    }
  }

  async createMetadataFromBuffer() {
    console.log(`executing createMetadataFromBuffer()`)
    if (this.songPath != undefined) {
      this.songMetadata = await window.MusicManager.getSongMetadata(
        this.songPath,
      )
    } else {
      throw new Error("Song path is undefined")
    }
  }

  createFrontCoverURL() {
    if (this.songMetadata != undefined) {
      if (this.songMetadata.frontCover != undefined) {
        this.frontCoverBlob = new Blob([
          base64ToUint8Array(this.songMetadata.frontCover),
        ])
        this.frontCoverURL = URL.createObjectURL(this.frontCoverBlob)
      } else {
        throw new Error("Front cover is undefined")
      }
    } else {
      throw new Error("Song metadata is undefined")
    }
  }

  getMetadata() {
    return this.songMetadata
  }

  getFrontCoverURL() {
    return this.frontCoverURL
  }

  clearBlobAndBuffer() {
    if (this.blob) {
      URL.revokeObjectURL(URL.createObjectURL(this.blob))
      this.blob = undefined
    }

    if (this.buffer) {
      this.buffer = undefined
    }
  }

  clearAll() {
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
  }
}

export { SongInfo }
