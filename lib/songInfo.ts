/* import { parseBuffer } from "music-metadata"
import { PathLike } from "original-fs"

export default class SongInfo {
  path: PathLike
  title: string

  constructor(songPath: string) {

  }
}
 */
interface SongInfo {
  title: string | undefined
  frontCover: string | undefined
  year: number | undefined
  album: string | undefined
  artist: string | undefined
  albumArtist: string | undefined
  genre: string[] | undefined
  length: number | undefined
  itemType: string | undefined
}

class SongInfo {
  title: string | undefined = undefined
  album: string | undefined = undefined
  frontCover: string | undefined = undefined
  year: number | undefined = undefined
  artist: string | undefined = undefined
  albumArtist: string | undefined = undefined
  genre: string[] | undefined = undefined
  duration: number | undefined = undefined
  itemType: string | undefined = undefined
}

export default SongInfo
