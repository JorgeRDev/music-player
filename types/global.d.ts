declare type SongPath = string

declare interface ISongMetadata {
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

declare interface IUserSettingsData {
  musicDirectories: string[],
  theme: "light" | "dark" | "system"
  language: "en" | "es"
}

declare interface ISongLyric {
  time: {
    minute: number
    second: number
    millisecond: number
  }
  timeInSeconds?: number
  lyric: string
}