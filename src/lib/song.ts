import { SongInfo } from "./songInfo"
import { Howl } from "howler"

export default class Song extends SongInfo {
  songPath: SongPath
  song: Howl | undefined
  constructor(songPath: SongPath) {
    super(songPath)
    this.songPath = songPath
  }

  play() {
    this.song = new Howl({
      src: [this.getURL()],
      html5: true,
    })

    this.song.play()
  }

  clearAll(): void {
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
