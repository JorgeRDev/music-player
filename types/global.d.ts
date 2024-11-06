/* import { Dialog, IpcRenderer } from "electron"
import { Dir } from "node:original-fs"
import SongInfo from "lib/songInfo"

declare global {
  interface Window {
    FileSystem: {
      chooseDirectories: () => Promise<string[] | null>
    }
    MusicManager: {
      getSongsInfoFromDirectories: (
        dirs: string[],
      ) => Promise<Map<string, SongInfo> | null>
      getSongInfo: (songBuffer: Buffer) => Promise<SongInfo>
      getSong: (songPath) => Promise<Buffer | undefined>
    }
    App: {
      onFullScreen: (callback: (arg: boolean) => void) => void
    }
  }
}
 */
