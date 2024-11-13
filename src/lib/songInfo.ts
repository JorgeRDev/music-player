import Song from "./song"

class SongInfo extends Song {
  constructor(songPath: SongPath) {
    console.log(`SongInfo() has been created with ${songPath}`)
    super()

    this.songPath = songPath

    this.getMetadataFromSongPath()
    this.createFrontCoverBlob()
  }
}

export { SongInfo }
