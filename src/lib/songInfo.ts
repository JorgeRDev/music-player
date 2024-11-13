import Song from "./song"

class SongInfo extends Song {
  constructor(songPath: SongPath) {
    console.log(`SongInfo() has been created with ${songPath}`)
    super()
    this.songPath = songPath
  }

  async init() {
    await this.getMetadataFromSongPath()
    await this.createFrontCoverBlob()
    await this.createFrontCoverURL()
  }
}

export { SongInfo }
