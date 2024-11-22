import { contextBridge, ipcRenderer } from "electron"
import { SongInfo } from "../src/lib/songInfo"
import { Configuration } from "../lib/configuration"

contextBridge.exposeInMainWorld("App", {
  FileSystem: {
    openDirectoriesSelectDialog: async (): Promise<string[] | null> =>
      ipcRenderer.invoke("openDirectoriesSelectDialog"),
  },
  MusicManager: {
    getSongsPathFromDirectories: (
      directories: string[],
      onSongPath: (songPath: string) => void,
    ) => {
      ipcRenderer.send("getSongsPathFromDirectories", directories)

      ipcRenderer.on(
        "getSongsPathFromDirectories-reply",
        (_event, songPath) => {
          onSongPath(songPath)
        },
      )
    },
    getSongBuffer: async (
      songPath: SongPath | undefined,
    ): Promise<Buffer | undefined> => {
      if (songPath == undefined) {
        throw new Error("Song path is undefined")
      }

      return ipcRenderer.invoke("getSongBuffer", songPath)
    },
    getSongMetadata: async (
      songPath: SongPath,
      options?: { compressImage: boolean },
    ): Promise<SongInfo | null> => {
      return ipcRenderer.invoke("getSongMetadata", songPath, options)
    },
  },
  FullScreen: {
    onFullScreen: (callback: (arg: boolean) => boolean) => {
      ipcRenderer.on("is-app-full-screen", (event, isFullScreen: boolean) => {
        if (isFullScreen) {
          console.log("La aplicación está en pantalla completa")
        } else {
          console.log("La aplicación no está en pantalla completa")
        }
        callback(isFullScreen)
      })
    },
  },
  Configuration: {
    readConfiguration: async (): Promise<Configuration> => {
      return ipcRenderer.invoke("readConfiguration")
    },
  },
})
