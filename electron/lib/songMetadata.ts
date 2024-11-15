/* import { parseBuffer } from "music-metadata"
import { PathLike } from "original-fs"

export default class SongInfo {
  path: PathLike
  title: string

  constructor(songPath: string) {

  }
}
 */
class SongMetadata {
  title: string | undefined = undefined
  album: string | undefined = undefined
  frontCover: string | undefined = undefined
  year: number | undefined = undefined
  artist: string | undefined = undefined
  albumArtist: string | undefined = undefined
  genre: string[] | undefined = undefined
  duration: number | undefined = undefined
  itemType: string | undefined = undefined
  format: string | undefined = undefined
}

export default SongMetadata
