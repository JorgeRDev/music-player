import { contextBridge, ipcRenderer } from "electron"
import { SongInfo } from "../src/lib/songInfo"
import pino, { Logger } from "pino"

contextBridge.exposeInMainWorld("FileSystem", {
  chooseDirectories: async (): Promise<string[] | null> =>
    ipcRenderer.invoke("chooseDirectories"),
})

contextBridge.exposeInMainWorld("MusicManager", {
  getSongsPathFromDirectories: (
    directories: string[],
    onSongPath: (songPath: string) => void,
  ) => {
    console.log(`executing getSongsPathFromDirectories(${directories})`)
    ipcRenderer.send("getSongsPathFromDirectories", directories)

    ipcRenderer.on("getSongsPathFromDirectories-reply", (_event, songPath) => {
      console.log(`getSongsPathFromDirectories-reply has recieved ${songPath}`)

      onSongPath(songPath)
    })
  },
  getSongBuffer: async (
    songPath: SongPath | undefined,
  ): Promise<Buffer | undefined> => {
    console.log(`executing getSongBuffer(${songPath})`)
    if (songPath == undefined) {
      throw new Error("Song path is undefined")
    }

    return ipcRenderer.invoke("getSongBuffer", songPath)
  },
  getSongMetadata: async (songPath: SongPath): Promise<SongInfo | null> => {
    console.info(`executing getSongMetadata(${songPath}) from preload`)
    return ipcRenderer.invoke("getSongMetadata", songPath)
  },
})

contextBridge.exposeInMainWorld("App", {
  onFullScreen: (callback: (arg: boolean) => boolean) => {
    console.log(`onFullscreen() se esta ejecutando desde preload.js`)

    ipcRenderer.on("is-app-full-screen", (event, isFullScreen: boolean) => {
      if (isFullScreen) {
        console.log("La aplicación está en pantalla completa")
      } else {
        console.log("La aplicación no está en pantalla completa")
      }
      callback(isFullScreen)
    })
  },
})
