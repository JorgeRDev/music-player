declare type SongPath = string

declare interface SongMetadata {
  title: string | undefined
  frontCover: string | undefined
  year: number | undefined
  album: string | undefined
  artist: string | undefined
  albumArtist: string | undefined
  genre: string[] | undefined
  duration: number | undefined
  itemType: string | undefined
  format: string | undefined
}

declare interface SongLyric {
  time: {
    minute: number
    second: number
    millisecond: number
  }
  timeInSeconds?: number
  lyric: string
}
